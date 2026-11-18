import { describe, expect, it } from "vitest";
import projects from "../../../content/projects.json";
import services from "../../../content/services.json";
import en from "../../messages/en.json";
import fa from "../../messages/fa.json";
import ru from "../../messages/ru.json";
import tr from "../../messages/tr.json";

const keys = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" && !Array.isArray(v) ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]);

describe("translations", () => {
  it.each([["tr", tr], ["fa", fa], ["ru", ru]])("%s has exactly the English keys", (_, messages) => {
    expect(keys(messages).sort()).toEqual(keys(en).sort());
  });

  it("every service and project is translated into en, tr, fa and ru", () => {
    for (const item of [...services, ...projects]) {
      expect(Object.keys(item.translations).sort(), item.slug).toEqual(["en", "fa", "ru", "tr"]);
    }
  });
});

describe("content honesty", () => {
  it("only links to real GitHub repositories of sinajokarr", () => {
    for (const p of projects) if (p.github_url) expect(p.github_url).toMatch(/^https:\/\/github\.com\/sinajokarr\//);
  });
  it("only live projects have a live URL", () => {
    for (const p of projects) if (p.live_url) expect(p.status).toBe("live");
  });
});
