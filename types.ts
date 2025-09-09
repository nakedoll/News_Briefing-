
export interface Source {
  web: {
    uri: string;
    title: string;
  };
}

export interface BriefingData {
  briefing: string;
  sources: Source[];
}
