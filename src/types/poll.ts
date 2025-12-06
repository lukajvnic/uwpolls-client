export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  options: PollOption[];
  totalVotes: number;
  allowSeeResults: boolean;
  userHasVoted?: boolean;
  userVotedOption?: number; // Option number (1-4) that user voted for
}