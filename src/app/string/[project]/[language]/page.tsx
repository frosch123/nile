import React from "react";
import { getNileConfig } from "@/static/NileConfig";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { ValidatorProvider } from "@/providers/ValidatorProvider";
import { ConfigProvider } from "@/providers/ConfigProvider";
import { ProjectProvider } from "@/providers/ProjectProvider";
import { Listing } from "./Listing";
import { LayoutCommon } from "@/components/LayoutCommon";

export default async function Home({ params }: { params: { project: string, language: string } }) {
  const { project, language } = params;
  const nileConfig = await getNileConfig();

  return (
    <main>
      <ValidatorProvider>
        <ConfigProvider config={nileConfig}>
          <ProjectProvider initialProject={project}>
            <LanguageProvider initialLanguage={language}>
              <LayoutCommon>
                <Listing />
              </LayoutCommon>
            </LanguageProvider>
          </ProjectProvider>
        </ConfigProvider>
      </ValidatorProvider>
    </main>
  );
}

export const generateStaticParams = async () => {
  const nileConfig = await getNileConfig();

  const entries = [];

  for (const [projectName, projectInfo] of Object.entries(nileConfig.projects)) {
    for (const language of projectInfo.languages) {
      entries.push({
        project: projectName,
        language: language,
      });
    }
  }

  return entries;
};
