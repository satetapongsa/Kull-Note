import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/User.js'
import mongoose from 'mongoose'

export function setupPassport() {
    passport.serializeUser((user, done) => {
        done(null, user.id || user._id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            // Check if MongoDB is connected
            if (mongoose.connection.readyState === 1) {
                const user = await User.findById(id)
                done(null, user)
            } else {
                done(null, null)
            }
        } catch (error) {
            done(error, null)
        }
    })

    // Only setup Google strategy if credentials are provided
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if MongoDB is connected
                if (mongoose.connection.readyState !== 1) {
                    // Fallback to in-memory user
                    const user = {
                        id: profile.id,
                        googleId: profile.id,
                        email: profile.emails[0]?.value,
                        name: profile.displayName,
                        avatar: profile.photos[0]?.value
                    }
                    return done(null, user)
                }

                let user = await User.findOne({ googleId: profile.id })

                if (!user) {
                    user = await User.create({
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        avatar: profile.photos[0]?.value
                    })
                }

                done(null, user)
            } catch (error) {
                done(error, null)
            }
        }))
        console.log('✅ Google OAuth configured')
    } else {
        console.log('⚠️  Google OAuth not configured - missing credentials')
    }
}
