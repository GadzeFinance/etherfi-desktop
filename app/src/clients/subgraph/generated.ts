import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

export type Bid = {
  __typename?: 'Bid';
  amount: Scalars['BigInt'];
  bidId: Scalars['BigInt'];
  bidder: Scalars['Bytes'];
  bidderPublicKey: Scalars['Bytes'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['ID'];
  status: BidStatus;
  transactionHash: Scalars['Bytes'];
};

export enum BidStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Won = 'WON'
}

export type Bid_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  and?: InputMaybe<Array<InputMaybe<Bid_Filter>>>;
  bidId?: InputMaybe<Scalars['BigInt']>;
  bidId_gt?: InputMaybe<Scalars['BigInt']>;
  bidId_gte?: InputMaybe<Scalars['BigInt']>;
  bidId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  bidId_lt?: InputMaybe<Scalars['BigInt']>;
  bidId_lte?: InputMaybe<Scalars['BigInt']>;
  bidId_not?: InputMaybe<Scalars['BigInt']>;
  bidId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  bidder?: InputMaybe<Scalars['Bytes']>;
  bidderPublicKey?: InputMaybe<Scalars['Bytes']>;
  bidderPublicKey_contains?: InputMaybe<Scalars['Bytes']>;
  bidderPublicKey_gt?: InputMaybe<Scalars['Bytes']>;
  bidderPublicKey_gte?: InputMaybe<Scalars['Bytes']>;
  bidderPublicKey_in?: InputMaybe<Array<Scalars['Bytes']>>;
  bidderPublicKey_lt?: InputMaybe<Scalars['Bytes']>;
  bidderPublicKey_lte?: InputMaybe<Scalars['Bytes']>;
  bidderPublicKey_not?: InputMaybe<Scalars['Bytes']>;
  bidderPublicKey_not_contains?: InputMaybe<Scalars['Bytes']>;
  bidderPublicKey_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  bidder_contains?: InputMaybe<Scalars['Bytes']>;
  bidder_gt?: InputMaybe<Scalars['Bytes']>;
  bidder_gte?: InputMaybe<Scalars['Bytes']>;
  bidder_in?: InputMaybe<Array<Scalars['Bytes']>>;
  bidder_lt?: InputMaybe<Scalars['Bytes']>;
  bidder_lte?: InputMaybe<Scalars['Bytes']>;
  bidder_not?: InputMaybe<Scalars['Bytes']>;
  bidder_not_contains?: InputMaybe<Scalars['Bytes']>;
  bidder_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  or?: InputMaybe<Array<InputMaybe<Bid_Filter>>>;
  status?: InputMaybe<BidStatus>;
  status_in?: InputMaybe<Array<BidStatus>>;
  status_not?: InputMaybe<BidStatus>;
  status_not_in?: InputMaybe<Array<BidStatus>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum Bid_OrderBy {
  Amount = 'amount',
  BidId = 'bidId',
  Bidder = 'bidder',
  BidderPublicKey = 'bidderPublicKey',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  Status = 'status',
  TransactionHash = 'transactionHash'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  bid?: Maybe<Bid>;
  bids: Array<Bid>;
  stake?: Maybe<Stake>;
  stakes: Array<Stake>;
  validator?: Maybe<Validator>;
  validators: Array<Validator>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryBidArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBidsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Bid_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Bid_Filter>;
};


export type QueryStakeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStakesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Stake_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Stake_Filter>;
};


export type QueryValidatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryValidatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Validator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Validator_Filter>;
};

export type Stake = {
  __typename?: 'Stake';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['ID'];
  phase: StakePhases;
  sender: Scalars['Bytes'];
  stakeId: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
  value: Scalars['BigInt'];
  winningBidId: Scalars['BigInt'];
};

export enum StakePhases {
  Cancelled = 'CANCELLED',
  Deposited = 'DEPOSITED',
  ValidatorRegistered = 'VALIDATOR_REGISTERED'
}

export type Stake_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Stake_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  or?: InputMaybe<Array<InputMaybe<Stake_Filter>>>;
  phase?: InputMaybe<StakePhases>;
  phase_in?: InputMaybe<Array<StakePhases>>;
  phase_not?: InputMaybe<StakePhases>;
  phase_not_in?: InputMaybe<Array<StakePhases>>;
  sender?: InputMaybe<Scalars['Bytes']>;
  sender_contains?: InputMaybe<Scalars['Bytes']>;
  sender_gt?: InputMaybe<Scalars['Bytes']>;
  sender_gte?: InputMaybe<Scalars['Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['Bytes']>>;
  sender_lt?: InputMaybe<Scalars['Bytes']>;
  sender_lte?: InputMaybe<Scalars['Bytes']>;
  sender_not?: InputMaybe<Scalars['Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['Bytes']>;
  sender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  stakeId?: InputMaybe<Scalars['BigInt']>;
  stakeId_gt?: InputMaybe<Scalars['BigInt']>;
  stakeId_gte?: InputMaybe<Scalars['BigInt']>;
  stakeId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  stakeId_lt?: InputMaybe<Scalars['BigInt']>;
  stakeId_lte?: InputMaybe<Scalars['BigInt']>;
  stakeId_not?: InputMaybe<Scalars['BigInt']>;
  stakeId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  value?: InputMaybe<Scalars['BigInt']>;
  value_gt?: InputMaybe<Scalars['BigInt']>;
  value_gte?: InputMaybe<Scalars['BigInt']>;
  value_in?: InputMaybe<Array<Scalars['BigInt']>>;
  value_lt?: InputMaybe<Scalars['BigInt']>;
  value_lte?: InputMaybe<Scalars['BigInt']>;
  value_not?: InputMaybe<Scalars['BigInt']>;
  value_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  winningBidId?: InputMaybe<Scalars['BigInt']>;
  winningBidId_gt?: InputMaybe<Scalars['BigInt']>;
  winningBidId_gte?: InputMaybe<Scalars['BigInt']>;
  winningBidId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  winningBidId_lt?: InputMaybe<Scalars['BigInt']>;
  winningBidId_lte?: InputMaybe<Scalars['BigInt']>;
  winningBidId_not?: InputMaybe<Scalars['BigInt']>;
  winningBidId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Stake_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  Phase = 'phase',
  Sender = 'sender',
  StakeId = 'stakeId',
  TransactionHash = 'transactionHash',
  Value = 'value',
  WinningBidId = 'winningBidId'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  bid?: Maybe<Bid>;
  bids: Array<Bid>;
  stake?: Maybe<Stake>;
  stakes: Array<Stake>;
  validator?: Maybe<Validator>;
  validators: Array<Validator>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionBidArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBidsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Bid_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Bid_Filter>;
};


export type SubscriptionStakeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStakesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Stake_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Stake_Filter>;
};


export type SubscriptionValidatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionValidatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Validator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Validator_Filter>;
};

export type Validator = {
  __typename?: 'Validator';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  encryptedValidatorKey: Scalars['Bytes'];
  encryptedValidatorKeyPassword: Scalars['Bytes'];
  id: Scalars['ID'];
  phase: ValidatorPhase;
  stakeId: Scalars['BigInt'];
  stakerPublicKey: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
  wanningBidId: Scalars['BigInt'];
  withdrawSafe?: Maybe<Scalars['Bytes']>;
};

export enum ValidatorPhase {
  Accepted = 'ACCEPTED',
  Exited = 'EXITED',
  HandoverReady = 'HANDOVER_READY',
  Running = 'RUNNING',
  Slashed = 'SLASHED'
}

export type Validator_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Validator_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  encryptedValidatorKey?: InputMaybe<Scalars['Bytes']>;
  encryptedValidatorKeyPassword?: InputMaybe<Scalars['Bytes']>;
  encryptedValidatorKeyPassword_contains?: InputMaybe<Scalars['Bytes']>;
  encryptedValidatorKeyPassword_gt?: InputMaybe<Scalars['Bytes']>;
  encryptedValidatorKeyPassword_gte?: InputMaybe<Scalars['Bytes']>;
  encryptedValidatorKeyPassword_in?: InputMaybe<Array<Scalars['Bytes']>>;
  encryptedValidatorKeyPassword_lt?: InputMaybe<Scalars['Bytes']>;
  encryptedValidatorKeyPassword_lte?: InputMaybe<Scalars['Bytes']>;
  encryptedValidatorKeyPassword_not?: InputMaybe<Scalars['Bytes']>;
  encryptedValidatorKeyPassword_not_contains?: InputMaybe<Scalars['Bytes']>;
  encryptedValidatorKeyPassword_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  encryptedValidatorKey_contains?: InputMaybe<Scalars['Bytes']>;
  encryptedValidatorKey_gt?: InputMaybe<Scalars['Bytes']>;
  encryptedValidatorKey_gte?: InputMaybe<Scalars['Bytes']>;
  encryptedValidatorKey_in?: InputMaybe<Array<Scalars['Bytes']>>;
  encryptedValidatorKey_lt?: InputMaybe<Scalars['Bytes']>;
  encryptedValidatorKey_lte?: InputMaybe<Scalars['Bytes']>;
  encryptedValidatorKey_not?: InputMaybe<Scalars['Bytes']>;
  encryptedValidatorKey_not_contains?: InputMaybe<Scalars['Bytes']>;
  encryptedValidatorKey_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  or?: InputMaybe<Array<InputMaybe<Validator_Filter>>>;
  phase?: InputMaybe<ValidatorPhase>;
  phase_in?: InputMaybe<Array<ValidatorPhase>>;
  phase_not?: InputMaybe<ValidatorPhase>;
  phase_not_in?: InputMaybe<Array<ValidatorPhase>>;
  stakeId?: InputMaybe<Scalars['BigInt']>;
  stakeId_gt?: InputMaybe<Scalars['BigInt']>;
  stakeId_gte?: InputMaybe<Scalars['BigInt']>;
  stakeId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  stakeId_lt?: InputMaybe<Scalars['BigInt']>;
  stakeId_lte?: InputMaybe<Scalars['BigInt']>;
  stakeId_not?: InputMaybe<Scalars['BigInt']>;
  stakeId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  stakerPublicKey?: InputMaybe<Scalars['Bytes']>;
  stakerPublicKey_contains?: InputMaybe<Scalars['Bytes']>;
  stakerPublicKey_gt?: InputMaybe<Scalars['Bytes']>;
  stakerPublicKey_gte?: InputMaybe<Scalars['Bytes']>;
  stakerPublicKey_in?: InputMaybe<Array<Scalars['Bytes']>>;
  stakerPublicKey_lt?: InputMaybe<Scalars['Bytes']>;
  stakerPublicKey_lte?: InputMaybe<Scalars['Bytes']>;
  stakerPublicKey_not?: InputMaybe<Scalars['Bytes']>;
  stakerPublicKey_not_contains?: InputMaybe<Scalars['Bytes']>;
  stakerPublicKey_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  wanningBidId?: InputMaybe<Scalars['BigInt']>;
  wanningBidId_gt?: InputMaybe<Scalars['BigInt']>;
  wanningBidId_gte?: InputMaybe<Scalars['BigInt']>;
  wanningBidId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  wanningBidId_lt?: InputMaybe<Scalars['BigInt']>;
  wanningBidId_lte?: InputMaybe<Scalars['BigInt']>;
  wanningBidId_not?: InputMaybe<Scalars['BigInt']>;
  wanningBidId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  withdrawSafe?: InputMaybe<Scalars['Bytes']>;
  withdrawSafe_contains?: InputMaybe<Scalars['Bytes']>;
  withdrawSafe_gt?: InputMaybe<Scalars['Bytes']>;
  withdrawSafe_gte?: InputMaybe<Scalars['Bytes']>;
  withdrawSafe_in?: InputMaybe<Array<Scalars['Bytes']>>;
  withdrawSafe_lt?: InputMaybe<Scalars['Bytes']>;
  withdrawSafe_lte?: InputMaybe<Scalars['Bytes']>;
  withdrawSafe_not?: InputMaybe<Scalars['Bytes']>;
  withdrawSafe_not_contains?: InputMaybe<Scalars['Bytes']>;
  withdrawSafe_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum Validator_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  EncryptedValidatorKey = 'encryptedValidatorKey',
  EncryptedValidatorKeyPassword = 'encryptedValidatorKeyPassword',
  Id = 'id',
  Phase = 'phase',
  StakeId = 'stakeId',
  StakerPublicKey = 'stakerPublicKey',
  TransactionHash = 'transactionHash',
  WanningBidId = 'wanningBidId',
  WithdrawSafe = 'withdrawSafe'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type BaseBidFragment = { __typename?: 'Bid', id: string, amount: any, bidId: any, bidder: any, status: BidStatus, transactionHash: any };

export type GetAllBidsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllBidsQuery = { __typename?: 'Query', bids: Array<{ __typename?: 'Bid', id: string, amount: any, bidId: any, bidder: any, blockNumber: any, blockTimestamp: any, transactionHash: any, status: BidStatus, bidderPublicKey: any }> };

export type GetUserBidsQueryVariables = Exact<{
  user?: InputMaybe<Scalars['Bytes']>;
}>;


export type GetUserBidsQuery = { __typename?: 'Query', bids: Array<{ __typename?: 'Bid', id: string, amount: any, bidId: any, bidder: any, blockNumber: any, blockTimestamp: any, transactionHash: any, status: BidStatus, bidderPublicKey: any }> };

export type GetCompetingBidsQueryVariables = Exact<{
  user?: InputMaybe<Scalars['Bytes']>;
}>;


export type GetCompetingBidsQuery = { __typename?: 'Query', bids: Array<{ __typename?: 'Bid', id: string, amount: any, bidId: any, bidder: any, blockNumber: any, blockTimestamp: any, transactionHash: any, status: BidStatus, bidderPublicKey: any }> };

export type GetBidByIdQueryVariables = Exact<{
  bidId?: InputMaybe<Scalars['BigInt']>;
}>;


export type GetBidByIdQuery = { __typename?: 'Query', bids: Array<{ __typename?: 'Bid', id: string, amount: any, bidId: any, bidder: any, blockNumber: any, blockTimestamp: any, transactionHash: any, status: BidStatus, bidderPublicKey: any }> };

export type GetAllStakesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllStakesQuery = { __typename?: 'Query', stakes: Array<{ __typename?: 'Stake', id: string, stakeId: any, sender: any, value: any, blockTimestamp: any, blockNumber: any, phase: StakePhases, transactionHash: any }> };

export type GetStakesByAddressQueryVariables = Exact<{
  stakerAddress?: InputMaybe<Scalars['Bytes']>;
}>;


export type GetStakesByAddressQuery = { __typename?: 'Query', stakes: Array<{ __typename?: 'Stake', id: string, stakeId: any, sender: any, value: any, blockTimestamp: any, blockNumber: any, phase: StakePhases, transactionHash: any }> };

export type GetDepositedStakesByAddressQueryVariables = Exact<{
  stakerAddress?: InputMaybe<Scalars['Bytes']>;
}>;


export type GetDepositedStakesByAddressQuery = { __typename?: 'Query', stakes: Array<{ __typename?: 'Stake', id: string, stakeId: any, sender: any, value: any, blockTimestamp: any, blockNumber: any, phase: StakePhases, transactionHash: any }> };

export type GetAllValidatorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllValidatorsQuery = { __typename?: 'Query', validators: Array<{ __typename?: 'Validator', id: string, wanningBidId: any, stakeId: any, encryptedValidatorKey: any, encryptedValidatorKeyPassword: any, stakerPublicKey: any, phase: ValidatorPhase, blockNumber: any, blockTimestamp: any, transactionHash: any, withdrawSafe?: any | null }> };

export const BaseBidFragmentDoc = gql`
    fragment BaseBid on Bid {
  id
  amount
  bidId
  bidder
  status
  transactionHash
}
    `;
export const GetAllBidsDocument = gql`
    query GetAllBids {
  bids {
    id
    amount
    bidId
    bidder
    blockNumber
    blockTimestamp
    transactionHash
    status
    bidderPublicKey
  }
}
    `;

/**
 * __useGetAllBidsQuery__
 *
 * To run a query within a React component, call `useGetAllBidsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllBidsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllBidsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllBidsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllBidsQuery, GetAllBidsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllBidsQuery, GetAllBidsQueryVariables>(GetAllBidsDocument, options);
      }
export function useGetAllBidsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllBidsQuery, GetAllBidsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllBidsQuery, GetAllBidsQueryVariables>(GetAllBidsDocument, options);
        }
export type GetAllBidsQueryHookResult = ReturnType<typeof useGetAllBidsQuery>;
export type GetAllBidsLazyQueryHookResult = ReturnType<typeof useGetAllBidsLazyQuery>;
export type GetAllBidsQueryResult = Apollo.QueryResult<GetAllBidsQuery, GetAllBidsQueryVariables>;
export const GetUserBidsDocument = gql`
    query GetUserBids($user: Bytes) {
  bids(where: {bidder: $user}) {
    id
    amount
    bidId
    bidder
    blockNumber
    blockTimestamp
    transactionHash
    status
    bidderPublicKey
  }
}
    `;

/**
 * __useGetUserBidsQuery__
 *
 * To run a query within a React component, call `useGetUserBidsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserBidsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserBidsQuery({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useGetUserBidsQuery(baseOptions?: Apollo.QueryHookOptions<GetUserBidsQuery, GetUserBidsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserBidsQuery, GetUserBidsQueryVariables>(GetUserBidsDocument, options);
      }
export function useGetUserBidsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserBidsQuery, GetUserBidsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserBidsQuery, GetUserBidsQueryVariables>(GetUserBidsDocument, options);
        }
export type GetUserBidsQueryHookResult = ReturnType<typeof useGetUserBidsQuery>;
export type GetUserBidsLazyQueryHookResult = ReturnType<typeof useGetUserBidsLazyQuery>;
export type GetUserBidsQueryResult = Apollo.QueryResult<GetUserBidsQuery, GetUserBidsQueryVariables>;
export const GetCompetingBidsDocument = gql`
    query GetCompetingBids($user: Bytes) {
  bids(where: {bidder_not: $user}) {
    id
    amount
    bidId
    bidder
    blockNumber
    blockTimestamp
    transactionHash
    status
    bidderPublicKey
  }
}
    `;

/**
 * __useGetCompetingBidsQuery__
 *
 * To run a query within a React component, call `useGetCompetingBidsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompetingBidsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompetingBidsQuery({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useGetCompetingBidsQuery(baseOptions?: Apollo.QueryHookOptions<GetCompetingBidsQuery, GetCompetingBidsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCompetingBidsQuery, GetCompetingBidsQueryVariables>(GetCompetingBidsDocument, options);
      }
export function useGetCompetingBidsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCompetingBidsQuery, GetCompetingBidsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCompetingBidsQuery, GetCompetingBidsQueryVariables>(GetCompetingBidsDocument, options);
        }
export type GetCompetingBidsQueryHookResult = ReturnType<typeof useGetCompetingBidsQuery>;
export type GetCompetingBidsLazyQueryHookResult = ReturnType<typeof useGetCompetingBidsLazyQuery>;
export type GetCompetingBidsQueryResult = Apollo.QueryResult<GetCompetingBidsQuery, GetCompetingBidsQueryVariables>;
export const GetBidByIdDocument = gql`
    query GetBidById($bidId: BigInt) {
  bids(where: {bidId: $bidId}) {
    id
    amount
    bidId
    bidder
    blockNumber
    blockTimestamp
    transactionHash
    status
    bidderPublicKey
  }
}
    `;

/**
 * __useGetBidByIdQuery__
 *
 * To run a query within a React component, call `useGetBidByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBidByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBidByIdQuery({
 *   variables: {
 *      bidId: // value for 'bidId'
 *   },
 * });
 */
export function useGetBidByIdQuery(baseOptions?: Apollo.QueryHookOptions<GetBidByIdQuery, GetBidByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBidByIdQuery, GetBidByIdQueryVariables>(GetBidByIdDocument, options);
      }
export function useGetBidByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBidByIdQuery, GetBidByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBidByIdQuery, GetBidByIdQueryVariables>(GetBidByIdDocument, options);
        }
export type GetBidByIdQueryHookResult = ReturnType<typeof useGetBidByIdQuery>;
export type GetBidByIdLazyQueryHookResult = ReturnType<typeof useGetBidByIdLazyQuery>;
export type GetBidByIdQueryResult = Apollo.QueryResult<GetBidByIdQuery, GetBidByIdQueryVariables>;
export const GetAllStakesDocument = gql`
    query GetAllStakes {
  stakes {
    id
    stakeId
    sender
    value
    blockTimestamp
    blockNumber
    phase
    transactionHash
  }
}
    `;

/**
 * __useGetAllStakesQuery__
 *
 * To run a query within a React component, call `useGetAllStakesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllStakesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllStakesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllStakesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllStakesQuery, GetAllStakesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllStakesQuery, GetAllStakesQueryVariables>(GetAllStakesDocument, options);
      }
export function useGetAllStakesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllStakesQuery, GetAllStakesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllStakesQuery, GetAllStakesQueryVariables>(GetAllStakesDocument, options);
        }
export type GetAllStakesQueryHookResult = ReturnType<typeof useGetAllStakesQuery>;
export type GetAllStakesLazyQueryHookResult = ReturnType<typeof useGetAllStakesLazyQuery>;
export type GetAllStakesQueryResult = Apollo.QueryResult<GetAllStakesQuery, GetAllStakesQueryVariables>;
export const GetStakesByAddressDocument = gql`
    query GetStakesByAddress($stakerAddress: Bytes) {
  stakes(where: {sender: $stakerAddress}) {
    id
    stakeId
    sender
    value
    blockTimestamp
    blockNumber
    phase
    transactionHash
  }
}
    `;

/**
 * __useGetStakesByAddressQuery__
 *
 * To run a query within a React component, call `useGetStakesByAddressQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStakesByAddressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStakesByAddressQuery({
 *   variables: {
 *      stakerAddress: // value for 'stakerAddress'
 *   },
 * });
 */
export function useGetStakesByAddressQuery(baseOptions?: Apollo.QueryHookOptions<GetStakesByAddressQuery, GetStakesByAddressQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStakesByAddressQuery, GetStakesByAddressQueryVariables>(GetStakesByAddressDocument, options);
      }
export function useGetStakesByAddressLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStakesByAddressQuery, GetStakesByAddressQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStakesByAddressQuery, GetStakesByAddressQueryVariables>(GetStakesByAddressDocument, options);
        }
export type GetStakesByAddressQueryHookResult = ReturnType<typeof useGetStakesByAddressQuery>;
export type GetStakesByAddressLazyQueryHookResult = ReturnType<typeof useGetStakesByAddressLazyQuery>;
export type GetStakesByAddressQueryResult = Apollo.QueryResult<GetStakesByAddressQuery, GetStakesByAddressQueryVariables>;
export const GetDepositedStakesByAddressDocument = gql`
    query GetDepositedStakesByAddress($stakerAddress: Bytes) {
  stakes(where: {sender: $stakerAddress, phase: DEPOSITED}) {
    id
    stakeId
    sender
    value
    blockTimestamp
    blockNumber
    phase
    transactionHash
  }
}
    `;

/**
 * __useGetDepositedStakesByAddressQuery__
 *
 * To run a query within a React component, call `useGetDepositedStakesByAddressQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDepositedStakesByAddressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDepositedStakesByAddressQuery({
 *   variables: {
 *      stakerAddress: // value for 'stakerAddress'
 *   },
 * });
 */
export function useGetDepositedStakesByAddressQuery(baseOptions?: Apollo.QueryHookOptions<GetDepositedStakesByAddressQuery, GetDepositedStakesByAddressQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDepositedStakesByAddressQuery, GetDepositedStakesByAddressQueryVariables>(GetDepositedStakesByAddressDocument, options);
      }
export function useGetDepositedStakesByAddressLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDepositedStakesByAddressQuery, GetDepositedStakesByAddressQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDepositedStakesByAddressQuery, GetDepositedStakesByAddressQueryVariables>(GetDepositedStakesByAddressDocument, options);
        }
export type GetDepositedStakesByAddressQueryHookResult = ReturnType<typeof useGetDepositedStakesByAddressQuery>;
export type GetDepositedStakesByAddressLazyQueryHookResult = ReturnType<typeof useGetDepositedStakesByAddressLazyQuery>;
export type GetDepositedStakesByAddressQueryResult = Apollo.QueryResult<GetDepositedStakesByAddressQuery, GetDepositedStakesByAddressQueryVariables>;
export const GetAllValidatorsDocument = gql`
    query GetAllValidators {
  validators {
    id
    wanningBidId
    stakeId
    encryptedValidatorKey
    encryptedValidatorKeyPassword
    stakerPublicKey
    phase
    blockNumber
    blockTimestamp
    transactionHash
    withdrawSafe
  }
}
    `;

/**
 * __useGetAllValidatorsQuery__
 *
 * To run a query within a React component, call `useGetAllValidatorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllValidatorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllValidatorsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllValidatorsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllValidatorsQuery, GetAllValidatorsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllValidatorsQuery, GetAllValidatorsQueryVariables>(GetAllValidatorsDocument, options);
      }
export function useGetAllValidatorsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllValidatorsQuery, GetAllValidatorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllValidatorsQuery, GetAllValidatorsQueryVariables>(GetAllValidatorsDocument, options);
        }
export type GetAllValidatorsQueryHookResult = ReturnType<typeof useGetAllValidatorsQuery>;
export type GetAllValidatorsLazyQueryHookResult = ReturnType<typeof useGetAllValidatorsLazyQuery>;
export type GetAllValidatorsQueryResult = Apollo.QueryResult<GetAllValidatorsQuery, GetAllValidatorsQueryVariables>;