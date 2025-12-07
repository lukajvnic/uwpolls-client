import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Toaster } from "sonner";
import { Navbar } from "./components/navbar";
import { PollCard } from "./components/poll-card";
import { LoginDialog } from "./components/login-dialog";
import { CreatePollDialog } from "./components/create-poll-dialog";
import type { Poll, PollOption } from "./types/poll";
import { api } from "./api";

// api.test({ name: "LUKA" });

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [filter, setFilter] = useState<"popular" | "recent" | "new" | "mypolls">("popular");
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [createPollDialogOpen, setCreatePollDialogOpen] = useState(false);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const [bubbleStyle, setBubbleStyle] = useState({ left: 0, width: 0 });

  // Helper function to transform backend poll data to frontend format
  const transformPollData = (backendPoll: any): Poll => {
    const options: PollOption[] = [];

    if (backendPoll.opt1) {
      options.push({ id: `${backendPoll.id}-1`, text: backendPoll.opt1, votes: backendPoll.res1 || 0 });
    }
    if (backendPoll.opt2) {
      options.push({ id: `${backendPoll.id}-2`, text: backendPoll.opt2, votes: backendPoll.res2 || 0 });
    }
    if (backendPoll.opt3) {
      options.push({ id: `${backendPoll.id}-3`, text: backendPoll.opt3, votes: backendPoll.res3 || 0 });
    }
    if (backendPoll.opt4) {
      options.push({ id: `${backendPoll.id}-4`, text: backendPoll.opt4, votes: backendPoll.res4 || 0 });
    }

    return {
      id: backendPoll.id,
      title: backendPoll.title,
      options: options,
      totalVotes: backendPoll.total_votes || backendPoll.totalvotes || 0,
      allowSeeResults: true, // Backend doesn't have this field, defaulting to true
      userHasVoted: backendPoll.user_has_voted || false,
      userVotedOption: backendPoll.user_voted_option, // Option number (1-4)
    };
  };

  const fetchPopularPolls = async () => {
    try {
      setIsLoading(true);
      const data = await api.fetchPolls({ filter: 'popular', page: 1 });
      // console.log(data);
      const transformedPolls = (data.polls || []).map(transformPollData);
      setPolls(transformedPolls);
      setCurrentPage(1);
      setHasMore(data.has_more || false);
    } catch (error) {
      console.error("Failed to fetch popular polls:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentPolls = async () => {
    try {
      setIsLoading(true);
      const data = await api.fetchPolls({ filter: 'recent', page: 1 });
      const transformedPolls = (data.polls || []).map(transformPollData);
      setPolls(transformedPolls);
      setCurrentPage(1);
      setHasMore(data.has_more || false);
    } catch (error) {
      console.error("Failed to fetch recent polls:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNewPolls = async () => {
    try {
      setIsLoading(true);
      const data = await api.fetchPolls({ filter: 'new', page: 1 });
      const transformedPolls = (data.polls || []).map(transformPollData);
      setPolls(transformedPolls);
      setCurrentPage(1);
      setHasMore(data.has_more || false);
    } catch (error) {
      console.error("Failed to fetch new polls:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyPolls = async () => {
    try {
      setIsLoading(true);
      const data = await api.fetchPolls({ filter: 'mypolls', page: 1 });
      const transformedPolls = (data.polls || []).map(transformPollData);
      setPolls(transformedPolls);
      setCurrentPage(1);
      setHasMore(data.has_more || false);
    } catch (error) {
      console.error("Failed to fetch my polls:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMorePolls = async () => {
    if (isLoading || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const data = await api.fetchPolls({ filter, page: nextPage });
      const transformedPolls = (data.polls || []).map(transformPollData);
      setPolls(prevPolls => [...prevPolls, ...transformedPolls]);
      setCurrentPage(nextPage);
      setHasMore(data.has_more || false);
    } catch (error) {
      console.error("Failed to fetch more polls:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const submitVote = async (pollId: string, optionId: string) => {
    try {
      // Extract option number from optionId (e.g., "1-2" -> 2)
      const optionNumber = parseInt(optionId.split('-')[1]);

      // Submit vote to backend
      const result = await api.submitVote(pollId, optionNumber);

      // Update poll with backend response
      if (result.data?.votePoll?.poll) {
        const updatedPollData = result.data.votePoll.poll;
        setPolls(prevPolls =>
          prevPolls.map(poll => {
            if (poll.id === pollId) {
              // Transform backend data to frontend format
              const options = poll.options.map((opt, index) => ({
                ...opt,
                votes: updatedPollData[`res${index + 1}`] || 0,
              }));

              return {
                ...poll,
                options: options,
                totalVotes: updatedPollData.totalvotes,
              };
            }
            return poll;
          })
        );
      }
    } catch (error) {
      console.error("Failed to submit vote:", error);
      // Optionally show error toast to user
    }
  };

  // Helper function to update a poll in the list (useful after backend calls)
  const updatePollInList = (updatedPoll: Poll) => {
    setPolls(prevPolls =>
      prevPolls.map(poll => (poll.id === updatedPoll.id ? updatedPoll : poll))
    );
  };

  // Handle filter changes
  const handleFilterChange = (newFilter: "popular" | "recent" | "new" | "mypolls") => {
    setFilter(newFilter);
    if (newFilter === "popular") {
      fetchPopularPolls();
    } else if (newFilter === "recent") {
      fetchRecentPolls();
    } else if (newFilter === "new") {
      fetchNewPolls();
    } else if (newFilter === "mypolls") {
      fetchMyPolls();
    }
  };

  // Update bubble position when filter or login state changes
  useEffect(() => {
    const container = filterContainerRef.current;
    if (!container) return;
    const buttons = container.querySelectorAll('button');
    // Filter index depends on whether logged-in buttons are visible
    const visibleFilters = isLoggedIn
      ? ["popular", "recent", "new", "mypolls"]
      : ["popular", "recent"];
    const filterIndex = visibleFilters.indexOf(filter);
    const button = buttons[filterIndex] as HTMLElement;
    if (button) {
      setBubbleStyle({
        left: button.offsetLeft,
        width: button.offsetWidth,
      });
    }
  }, [filter, isLoggedIn]);

  // Fetch initial polls on mount
  useEffect(() => {
    fetchPopularPolls();
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMorePolls();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [polls, filter, isLoadingMore]);

  const handleLogout = async () => {
    try {
      await api.logout();
      setIsLoggedIn(false);
      // Reset filter to 'popular' if on a logged-in-only filter
      if (filter === 'new' || filter === 'mypolls') {
        setFilter('popular');
        await fetchPopularPolls();
      } else if (filter === 'popular') {
        await fetchPopularPolls();
      } else {
        await fetchRecentPolls();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAuthClick = async () => {
    if (isLoggedIn) {
      await handleLogout();
    } else {
      setLoginDialogOpen(true);
    }
  };

  const handleLoginSuccess = async () => {
    setIsLoggedIn(true);
    setLoginDialogOpen(false);
    // Refetch polls to update userHasVoted and userVotedOption for logged-in user
    if (filter === 'popular') {
      await fetchPopularPolls();
    } else if (filter === 'recent') {
      await fetchRecentPolls();
    } else if (filter === 'new') {
      await fetchNewPolls();
    } else if (filter === 'mypolls') {
      await fetchMyPolls();
    }
  };

  const handleCreateClick = () => {
    setCreatePollDialogOpen(true);
  };

  const handlePollCreated = () => {
    // Refetch polls based on current filter
    if (filter === "popular") {
      fetchPopularPolls();
    } else if (filter === "recent") {
      fetchRecentPolls();
    } else if (filter === "new") {
      fetchNewPolls();
    } else if (filter === "mypolls") {
      fetchMyPolls();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onCreateClick={handleCreateClick}
        isLoggedIn={isLoggedIn}
        onAuthClick={handleAuthClick}
      />

      {/* Rainbow gradient decoration */}
      <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-[10%] -right-[10%] w-[120%] h-[350px] bg-gradient-to-br from-pink-500/60 via-purple-500/50 to-transparent blur-3xl"
          style={{ animation: 'gradient-shift-1 8s ease-in-out infinite' }}
        />
        <div
          className="absolute -top-32 -left-[10%] -right-[10%] w-[120%] h-[320px] bg-gradient-to-bl from-blue-500/60 via-cyan-500/50 to-transparent blur-3xl"
          style={{ animation: 'gradient-shift-2 10s ease-in-out infinite' }}
        />
        <div
          className="absolute -top-24 -left-[10%] -right-[10%] w-[120%] h-[300px] bg-gradient-to-b from-yellow-400/50 via-orange-400/40 to-transparent blur-3xl"
          style={{ animation: 'gradient-shift-3 12s ease-in-out infinite' }}
        />
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12 relative">
        {/* Hero Section */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h1 className="mb-4 text-5xl font-serif-display">Discover what people think.</h1>
          <p className="text-muted-foreground font-serif-display">
            Vote on trending polls, share your opinions, and see real-time results from the community.
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex justify-center mb-6">
          <div ref={filterContainerRef} className="inline-flex items-center p-0.5 rounded-full border border-border bg-background shadow-lg relative">
            {/* Sliding background */}
            <div
              className="absolute top-0.5 bottom-0.5 bg-gray-100 rounded-full transition-all duration-300 ease-out"
              style={{ left: bubbleStyle.left, width: bubbleStyle.width }}
            />
            <button
              onClick={() => handleFilterChange("popular")}
              className={`px-6 py-1.5 rounded-full transition-colors cursor-pointer relative z-10 ${filter === "popular"
                ? "text-foreground"
                : "text-foreground/60 hover:text-foreground/80"
                }`}
            >
              Popular
            </button>
            <button
              onClick={() => handleFilterChange("recent")}
              className={`px-6 py-1.5 rounded-full transition-colors cursor-pointer relative z-10 ${filter === "recent"
                ? "text-foreground"
                : "text-foreground/60 hover:text-foreground/80"
                }`}
            >
              Recent
            </button>
            {isLoggedIn && (
              <button
                onClick={() => handleFilterChange("new")}
                className={`px-6 py-1.5 rounded-full transition-colors cursor-pointer relative z-10 ${filter === "new"
                  ? "text-foreground"
                  : "text-foreground/60 hover:text-foreground/80"
                  }`}
              >
                New
              </button>
            )}
            {isLoggedIn && (
              <button
                onClick={() => handleFilterChange("mypolls")}
                className={`px-6 py-1.5 rounded-full transition-colors cursor-pointer relative z-10 ${filter === "mypolls"
                  ? "text-foreground"
                  : "text-foreground/60 hover:text-foreground/80"
                  }`}
              >
                My Polls
              </button>
            )}
          </div>
        </div>

        {/* Polls Feed */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary" style={{ animation: "spin 1s linear infinite" }} />
            </div>
          ) : polls.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-muted-foreground text-center">
                No polls found with the selected filter. Try a different one!
              </p>
            </div>
          ) : (
            polls.map((poll) => (
              <PollCard
                key={poll.id}
                pollId={poll.id}
                title={poll.title}
                options={poll.options}
                totalVotes={poll.totalVotes}
                onVote={submitVote}
                allowSeeResults={poll.allowSeeResults}
                isLoggedIn={isLoggedIn}
                userHasVoted={poll.userHasVoted}
                userVotedOption={poll.userVotedOption}
              />
            ))
          )}
        </div>

        {/* Infinite Scroll Loader */}
        {!isLoading && isLoadingMore && (
          <div className="flex items-center justify-center mt-6 py-6">
            <Loader2 className="w-8 h-8 text-primary" style={{ animation: "spin 1s linear infinite" }} />
          </div>
        )}
        <div ref={observerTarget} className="h-10" />
      </main>

      <LoginDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
        onLoginSuccess={handleLoginSuccess}
      />
      <CreatePollDialog
        open={createPollDialogOpen}
        onOpenChange={setCreatePollDialogOpen}
        onPollCreated={handlePollCreated}
      />
      <Toaster />
    </div>
  );
}