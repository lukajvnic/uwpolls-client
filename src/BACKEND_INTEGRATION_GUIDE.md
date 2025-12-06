# Backend Integration Guide

This document outlines all the empty functions ready for backend integration.

## Data Types

See `/types/poll.ts` for the Poll and PollOption interfaces.

**Poll Interface:**
- `id`: string - Unique poll identifier
- `title`: string - Poll question
- `options`: PollOption[] - Array of 2-4 poll options
- `totalVotes`: number - Total vote count
- `allowSeeResults`: boolean - Whether users can see results without voting

## Functions to Implement

### 1. App.tsx - Poll Management

#### `fetchPopularPolls()`
- **Location**: `/App.tsx` line ~42
- **Purpose**: Fetch popular polls from backend
- **Expected behavior**: 
  - Call backend API to get popular polls
  - Update `polls` state with `setPolls(data)`

#### `fetchRecentPolls()`
- **Location**: `/App.tsx` line ~49
- **Purpose**: Fetch recent polls from backend
- **Expected behavior**:
  - Call backend API to get recent polls
  - Update `polls` state with `setPolls(data)`

#### `fetchMorePolls()`
- **Location**: `/App.tsx` line ~56
- **Purpose**: Infinite scroll - load more polls
- **Expected behavior**:
  - Call backend API with offset (current polls.length)
  - Append new polls to existing list: `setPolls([...polls, ...newPolls])`
  - Set `isLoadingMore` state appropriately

#### `submitVote(pollId, optionId)`
- **Location**: `/App.tsx` line ~73
- **Purpose**: Submit user's vote to backend
- **Parameters**:
  - `pollId`: string - ID of the poll
  - `optionId`: string - ID of the selected option
- **Expected behavior**:
  - Call backend API to record vote
  - Receive updated poll data from backend
  - Update poll in list using `updatePollInList(updatedPoll)`

### 2. CreatePollDialog.tsx - Poll Creation

#### `handleCreatePoll(e)`
- **Location**: `/components/create-poll-dialog.tsx` line ~43
- **Purpose**: Create a new poll
- **Form data**:
  - `title`: string - Poll question
  - `options`: string[] - Array of 2-4 poll options (dynamically added by user)
  - `allowSeeResults`: boolean - Whether users can see results without voting
- **Expected behavior**:
  - Call backend API to create new poll with title, options array, and allowSeeResults flag
  - Receive new poll data from backend
  - Add new poll to the polls list (you may need to pass a callback from App.tsx)
  - Reset form fields
  - Close dialog with `onOpenChange(false)`

### 3. LoginDialog.tsx - Authentication

#### `handleLogin(e)`
- **Location**: `/components/login-dialog.tsx` line ~22
- **Purpose**: Email/password login
- **Expected behavior**:
  - Call backend API with email and password
  - Store user session/token
  - Close dialog with `onOpenChange(false)`

#### `handleSignUp(e)`
- **Location**: `/components/login-dialog.tsx` line ~32
- **Purpose**: Email/password sign up
- **Expected behavior**:
  - Call backend API to create new user
  - Store user session/token
  - Close dialog with `onOpenChange(false)`

#### `handleGoogleLogin()`
- **Location**: `/components/login-dialog.tsx` line ~42
- **Purpose**: Google OAuth login
- **Expected behavior**:
  - Redirect to Google OAuth or open popup
  - Handle OAuth callback
  - Store user session/token
  - Close dialog with `onOpenChange(false)`

## Helper Functions

### `updatePollInList(updatedPoll)`
- **Location**: `/App.tsx` line ~104
- **Purpose**: Update a single poll in the polls array
- **Usage**: Call this after receiving updated poll data from backend

## State Management

### Polls State
- **Location**: `/App.tsx`
- **State**: `polls` (array of Poll objects)
- **Setter**: `setPolls`
- **Initial data**: `getInitialPolls()` - replace with API call

### Dynamic Updates
- All poll vote counts are stored in the `polls` state
- PollCard receives data via props and updates are handled by parent
- Vote counts and totals are easily updatable through the `polls` state

## Infinite Scroll

- Implemented using IntersectionObserver
- Observes the bottom of the page (`observerTarget`)
- Automatically calls `fetchMorePolls()` when user scrolls near bottom
- `isLoadingMore` prevents duplicate requests

## Current Behavior

All functions currently:
1. Log to console
2. Have commented examples of expected backend integration
3. Maintain local state updates for UI demonstration

Replace the TODO comments with actual API calls when ready.