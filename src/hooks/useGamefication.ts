import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SessionData {
  userId: string;
  scenarioType: string;
  confidenceScore: number;
  fluencyScore: number;
  toneScore: number;
  durationSeconds: number;
}

export const useGamefication = () => {
  const calculateXP = (confidence: number, fluency: number, tone: number): number => {
    const avgScore = (confidence + fluency + tone) / 3;
    const baseXP = Math.round(avgScore * 0.5); // Max 50 XP per session
    const bonusXP = avgScore >= 90 ? 20 : avgScore >= 75 ? 10 : 0;
    return baseXP + bonusXP;
  };

  const saveSession = async (sessionData: SessionData) => {
    try {
      const xpEarned = calculateXP(
        sessionData.confidenceScore,
        sessionData.fluencyScore,
        sessionData.toneScore
      );

      // Save session record
      const { error: sessionError } = await supabase
        .from("user_sessions")
        .insert({
          user_id: sessionData.userId,
          scenario_type: sessionData.scenarioType,
          confidence_score: sessionData.confidenceScore,
          fluency_score: sessionData.fluencyScore,
          tone_score: sessionData.toneScore,
          duration_seconds: sessionData.durationSeconds,
          xp_earned: xpEarned,
        });

      if (sessionError) throw sessionError;

      // Update profile: XP, level, total_sessions, streak
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", sessionData.userId)
        .single();

      if (!profile) return { xpEarned, newAchievements: [] };

      const today = new Date().toISOString().split("T")[0];
      const lastPractice = profile.last_practice_date;
      let newStreakDays = profile.streak_days;

      // Update streak
      if (!lastPractice) {
        newStreakDays = 1;
      } else {
        const lastDate = new Date(lastPractice);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
        
        if (diffDays === 1) {
          newStreakDays = profile.streak_days + 1;
        } else if (diffDays > 1) {
          newStreakDays = 1;
        }
      }

      await supabase
        .from("profiles")
        .update({
          xp: profile.xp + xpEarned,
          total_sessions: profile.total_sessions + 1,
          streak_days: newStreakDays,
          last_practice_date: today,
        })
        .eq("id", sessionData.userId);

      // Update statistics
      const { data: stats } = await supabase
        .from("user_statistics")
        .select("*")
        .eq("user_id", sessionData.userId)
        .single();

      if (stats) {
        const totalSessions = profile.total_sessions + 1;
        const newAvgConfidence = ((stats.avg_confidence * profile.total_sessions) + sessionData.confidenceScore) / totalSessions;
        const newAvgFluency = ((stats.avg_fluency * profile.total_sessions) + sessionData.fluencyScore) / totalSessions;
        const newAvgTone = ((stats.avg_tone * profile.total_sessions) + sessionData.toneScore) / totalSessions;

        await supabase
          .from("user_statistics")
          .update({
            total_practice_time: stats.total_practice_time + sessionData.durationSeconds,
            avg_confidence: newAvgConfidence,
            avg_fluency: newAvgFluency,
            avg_tone: newAvgTone,
            total_xp_earned: stats.total_xp_earned + xpEarned,
          })
          .eq("user_id", sessionData.userId);
      }

      // Check for new achievements
      const newAchievements = await checkAchievements(sessionData.userId, {
        totalSessions: profile.total_sessions + 1,
        streakDays: newStreakDays,
        confidenceScore: sessionData.confidenceScore,
        fluencyScore: sessionData.fluencyScore,
        toneScore: sessionData.toneScore,
      });

      return { xpEarned, newAchievements };
    } catch (error) {
      console.error("Error saving session:", error);
      toast.error("Error al guardar sesión");
      return { xpEarned: 0, newAchievements: [] };
    }
  };

  const checkAchievements = async (userId: string, data: {
    totalSessions: number;
    streakDays: number;
    confidenceScore: number;
    fluencyScore: number;
    toneScore: number;
  }) => {
    try {
      // Get all achievements
      const { data: allAchievements } = await supabase
        .from("achievements")
        .select("*");

      // Get user's unlocked achievements
      const { data: unlockedAchievements } = await supabase
        .from("user_achievements")
        .select("achievement_id")
        .eq("user_id", userId);

      const unlockedIds = new Set(unlockedAchievements?.map(a => a.achievement_id) || []);
      const newlyUnlocked = [];

      for (const achievement of allAchievements || []) {
        if (unlockedIds.has(achievement.id)) continue;

        let shouldUnlock = false;

        switch (achievement.requirement_type) {
          case "sessions":
            shouldUnlock = data.totalSessions >= achievement.requirement_value;
            break;
          case "streak":
            shouldUnlock = data.streakDays >= achievement.requirement_value;
            break;
          case "score":
            if (achievement.code === "perfectionist") {
              shouldUnlock = data.confidenceScore >= 90 && data.fluencyScore >= 90 && data.toneScore >= 90;
            } else if (achievement.code === "confident") {
              shouldUnlock = data.confidenceScore >= achievement.requirement_value;
            } else if (achievement.code === "fluent") {
              shouldUnlock = data.fluencyScore >= achievement.requirement_value;
            } else if (achievement.code === "toned") {
              shouldUnlock = data.toneScore >= achievement.requirement_value;
            }
            break;
        }

        if (shouldUnlock) {
          await supabase
            .from("user_achievements")
            .insert({
              user_id: userId,
              achievement_id: achievement.id,
            });

          // Award XP for achievement
          const { data: profile } = await supabase
            .from("profiles")
            .select("xp")
            .eq("id", userId)
            .single();

          if (profile) {
            await supabase
              .from("profiles")
              .update({ xp: profile.xp + achievement.xp_reward })
              .eq("id", userId);
          }

          newlyUnlocked.push(achievement);
        }
      }

      return newlyUnlocked;
    } catch (error) {
      console.error("Error checking achievements:", error);
      return [];
    }
  };

  return { saveSession };
};
