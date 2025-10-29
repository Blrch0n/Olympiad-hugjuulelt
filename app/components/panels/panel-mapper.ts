import { SectionId } from "@/app/lib/galaxy-types";
import {
  AboutPanel,
  RulesPanel,
  PrizesPanel,
  SponsorPanel,
  ContactPanel,
  RegisterPanel,
  FaqPanel,
} from "./index";

export const PANEL_COMPONENTS = {
  about: AboutPanel,
  rules: RulesPanel,
  prizes: PrizesPanel,
  sponsor: SponsorPanel,
  contact: ContactPanel,
  register: RegisterPanel,
  faq: FaqPanel,
} as const;

export type PanelComponent = (typeof PANEL_COMPONENTS)[SectionId];
