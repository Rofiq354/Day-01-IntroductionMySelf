import db from "../config/db.js";
import techIcon from "../helper/techIcon.js";

const DEFAULT_ICON_URL =
  "https://img.icons8.com/?size=100&id=QMzLJhP7maxG&format=png&color=000000";

let id = 1;

const seedTechStacks = async () => {
  try {
    for (const key in techIcon) {
      const tech = techIcon[key];

      await db.query(
        `
        INSERT INTO tech_stacks (id, name, fa_icon, icons8_url, color_icon)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          id++,
          tech.techName,
          tech.icon,
          tech.url || DEFAULT_ICON_URL,
          tech.color,
        ]
      );
    }

    console.log("✅ Tech stacks seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedTechStacks();
