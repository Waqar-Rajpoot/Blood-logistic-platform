import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Request from "@/models/requestModel";
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";


export async function GET() {
    try {
        
        await connect();
        const cachedStats = await redis.get("admin_stats");

        if (cachedStats) {
        console.log("Serving from Cache");
        return NextResponse.json(cachedStats);
        }
        // Fetch stats in parallel for better performance
        const [users, requests] = await Promise.all([
            User.find({}),
            Request.find({})
        ]);

        const stats = {
            totalUsers: users.length,
            totalDonors: users.filter(u => u.role === "donor").length,
            activeRequests: requests.filter(r => r.status === "Pending").length,
            successfulMatches: requests.filter(r => r.status === "Fulfilled").length,
            urgentRequests: requests.filter(r => r.isUrgent && r.status === "Pending").length,
            pendingVerifications: users.filter(u => u.role === "donor" && !u.isVerified).length,
            recentActivity: requests.slice(-5).reverse().map(r => ({
                id: r._id,
                type: "Blood Request",
                patientName: r.patientName,
                city: r.city,
                bloodGroup: r.bloodGroup,
                createdAt: r.createdAt
            }))
        };

        await redis.set("admin_stats", JSON.stringify(stats), { ex: 300 }); 
        console.log("Serving from MongoDB & Updating Cache");
        return NextResponse.json(stats);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}