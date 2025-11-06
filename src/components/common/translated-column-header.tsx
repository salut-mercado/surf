import { Translation } from "react-i18next";

export const TranslatedColumnHeader = ({ children }: { children: string }) => {
  return <Translation>{(t) => <>{t(children)}</>}</Translation>;
};
