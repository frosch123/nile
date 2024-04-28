'use client'
import React from "react";
import { LanguageContext } from "./LanguageProvider";
import { ValidatorContext } from "./ValidatorProvider";
import { Accordion, Box, LoadingOverlay } from "@mantine/core";

const ListingItem = ({ items, id, name } : { items?: string[], id: string, name: string }) => {
  return (
    <Accordion.Item value={id}>
      <Accordion.Control disabled={items?.length === 0}>
        {name} ({items?.length ?? 0})
      </Accordion.Control>
      <Accordion.Panel>
        {items?.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </Accordion.Panel>
    </Accordion.Item>
  )
}

export const Listing = () => {
  const language = React.useContext(LanguageContext);
  const validator = React.useContext(ValidatorContext);

  const [outdatedKeys, setOutdatedKeys] = React.useState<string[] | undefined>(undefined);
  const [missingKeys, setMissingKeys] = React.useState<string[] | undefined>(undefined);
  const [invalidKeys, setInvalidKeys] = React.useState<string[] | undefined>(undefined);

  React.useEffect(() => {
    if (language.current.base === undefined || language.current.strings === undefined || validator.validator === undefined) return;

    setOutdatedKeys(Object.keys(language.current.strings).filter(key => language.current.base?.[key].version !== language.current.strings?.[key].version));
    setMissingKeys(Object.keys(language.current.base).filter(key => language.current.strings?.[key] === undefined));

    const languageConfig = {
      cases: [],
      genders: [],
      plural_count: 1,
    }

    const newInvalidKeys = [];
    for (const key in language.current.strings) {
      const base = language.current.base[key].cases["default"];

      for (const tcase in language.current.strings[key].cases) {
        const translation = language.current.strings[key].cases[tcase];
        if (validator.validator.validate(languageConfig, base, tcase, translation) !== null) {
          newInvalidKeys.push(key);
        }
      }
    }
    setInvalidKeys(newInvalidKeys);
  }, [language, validator]);

  return (
    <Box pos="relative">
      <LoadingOverlay visible={outdatedKeys === undefined} loaderProps={{ type: "dots" }} />
      <Accordion>
        <ListingItem items={outdatedKeys} id="outdated-strings" name="Outdated Strings" />
        <ListingItem items={missingKeys} id="missing-strings" name="Missing Strings" />
        <ListingItem items={invalidKeys} id="invalid-strings" name="Invalid Strings" />
      </Accordion>
    </Box>
  );
}
