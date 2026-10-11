
import { randomUUID } from "node:crypto";
import { getAuth } from "firebase-admin/auth";
import type { Request, Response } from "express";
import { app } from "../config/firebase.js";
import User from "../model/user.model.js";
import redis from "../../../../shared/redis/redis.js";

export const login = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        if (!token || typeof token !== "string") {
            return res.status(400).json({
                success: false,
                message: "Firebase ID token is required"
            });
        }

        let decoded;

        try {
            decoded = await getAuth(app).verifyIdToken(token);
        } catch {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired Firebase ID token"
            });
        }

        let user = await User.findOne({
            firebaseUid: decoded.uid
        });

        if (!user) {
            user = await User.create({
                name: decoded.name || "",
                email: decoded.email || "",
                firebaseUid: decoded.uid
            });
        }

        const sessionId = randomUUID();

        await redis.set(
            `session:${sessionId}`,
            JSON.stringify({
                userId: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role
            }),
            "EX",
            7 * 24 * 60 * 60
        );

        res.cookie("session", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const sessionId = req.cookies?.session;

        if (sessionId) {
            await redis.del(`session:${sessionId}`);
        }

        res.clearCookie("session", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        console.error("Logout Error:", error);

        return res.status(500).json({
            success: false,
            message: "Logout failed"
        });
    }
};