import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import type { PollOption } from "../types/poll";

interface PollCardProps {
  pollId: string;
  title: string;
  options: PollOption[];
  totalVotes: number;
  onVote: (pollId: string, optionId: string) => void;
  allowSeeResults: boolean;
  isLoggedIn: boolean;
  userHasVoted?: boolean;
  userVotedOption?: number; // Option number (1-4)
}

export function PollCard({ pollId, title, options, totalVotes, onVote, allowSeeResults, isLoggedIn, userHasVoted, userVotedOption }: PollCardProps) {
  // Initialize selectedOption from userVotedOption (convert option number to optionId)
  const userSelectedOptionId = userVotedOption ? `${pollId}-${userVotedOption}` : null;
  const [selectedOption, setSelectedOption] = useState<string | null>(userSelectedOptionId);
  const [hasVoted, setHasVoted] = useState(userHasVoted || false);
  const [hasPeeked, setHasPeeked] = useState(false);
  const [showAnimation, setShowAnimation] = useState(userHasVoted || false);

  // Update local state when props change (from backend updates)
  useEffect(() => {
    // Props will update from backend, no need for local state
  }, [options, totalVotes]);

  // Reset state when userHasVoted changes (e.g., when switching users or logging out)
  useEffect(() => {
    const userSelectedOptionId = userVotedOption ? `${pollId}-${userVotedOption}` : null;
    setHasVoted(userHasVoted || false);
    setShowAnimation(userHasVoted || false);
    setSelectedOption(userSelectedOptionId);
    if (!userHasVoted) {
      setHasPeeked(false);
    }
  }, [userHasVoted, userVotedOption, pollId]);

  // Trigger animation when results are shown
  useEffect(() => {
    if (hasVoted || hasPeeked) {
      // Small delay to ensure animation is visible
      setTimeout(() => setShowAnimation(true), 10);
    }
  }, [hasVoted, hasPeeked]);

  const handleVote = () => {
    if (selectedOption && !hasVoted && !hasPeeked) {
      setHasVoted(true);
      onVote(pollId, selectedOption);
    }
  };

  const handleSeeResults = () => {
    setHasPeeked(true);
  };

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const showResults = hasVoted || hasPeeked;

  return (
    <div className="border border-border rounded-xl p-5 bg-card hover:border-foreground/20 transition-all shadow-lg">
      <h3 className="mb-4">{title}</h3>

      <div className="space-y-2 mb-4">
        {options.map((option) => {
          const percentage = getPercentage(option.votes);
          const isSelected = selectedOption === option.id;

          return (
            <div key={option.id}>
              <button
                onClick={() => !showResults && setSelectedOption(option.id)}
                disabled={showResults}
                className={`w-full text-left px-3 py-2 rounded-lg border transition-all relative overflow-hidden ${showResults
                  ? hasVoted && isSelected
                    ? "border-green-500 cursor-default"
                    : "cursor-default"
                  : isSelected
                    ? "border-gray-400 bg-primary/5 cursor-pointer"
                    : "border-border hover:border-foreground/30 cursor-pointer"
                  }`}
              >
                {showResults && (
                  <div
                    className={`absolute inset-0 transition-all duration-700 ease-out ${hasVoted && isSelected ? "bg-green-500/10" : "bg-primary/10"
                      }`}
                    style={{ width: showAnimation ? `${percentage}%` : '0%' }}
                  />
                )}

                <div className="relative flex items-center justify-between">
                  <span className={showResults ? "text-foreground" : ""}>
                    {option.text}
                  </span>
                  {showResults && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{percentage}%</span>
                      {hasVoted && isSelected && <Check className="w-4 h-4 text-green-600" />}
                    </div>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
          {allowSeeResults && !showResults && (
            <>
              <span className="mx-1.5">•</span>
              <button
                onClick={handleSeeResults}
                className="border-b border-dotted border-muted-foreground hover:border-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                See results
              </button>
            </>
          )}
        </p>

        <button
          onClick={handleVote}
          disabled={!selectedOption || hasVoted || hasPeeked || !isLoggedIn}
          className={`px-5 py-1.5 rounded-lg transition-all ${!selectedOption || hasVoted || hasPeeked || !isLoggedIn
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "bg-primary text-primary-foreground hover:opacity-90 cursor-pointer"
            }`}
        >
          {hasVoted ? "Voted" : hasPeeked ? "Results shown" : "Vote"}
        </button>
      </div>
    </div>
  );
}