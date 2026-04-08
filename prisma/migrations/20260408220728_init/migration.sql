-- CreateTable
CREATE TABLE "Jurisdiction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'state',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "office" TEXT NOT NULL,
    "party" TEXT,
    "jurisdictionId" TEXT NOT NULL,
    "shortSummary" TEXT NOT NULL,
    "longSummary" TEXT,
    "imageUrl" TEXT,
    "websiteUrl" TEXT,
    "electionDate" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Candidate_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "Jurisdiction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CandidateTopic" (
    "candidateId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    PRIMARY KEY ("candidateId", "topicId"),
    CONSTRAINT "CandidateTopic_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CandidateTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Stance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "candidateId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Stance_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BallotMeasure" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "measureCode" TEXT,
    "jurisdictionId" TEXT NOT NULL,
    "electionDate" TEXT,
    "category" TEXT,
    "shortSummary" TEXT NOT NULL,
    "longSummary" TEXT,
    "yesMeans" TEXT,
    "noMeans" TEXT,
    "proArguments" TEXT,
    "conArguments" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BallotMeasure_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "Jurisdiction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MeasureTopic" (
    "measureId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    PRIMARY KEY ("measureId", "topicId"),
    CONSTRAINT "MeasureTopic_measureId_fkey" FOREIGN KEY ("measureId") REFERENCES "BallotMeasure" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MeasureTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Swipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "candidateId" TEXT,
    "measureId" TEXT,
    "choice" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Swipe_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Swipe_measureId_fkey" FOREIGN KEY ("measureId") REFERENCES "BallotMeasure" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Jurisdiction_abbreviation_key" ON "Jurisdiction"("abbreviation");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_name_key" ON "Topic"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_slug_key" ON "Topic"("slug");

-- CreateIndex
CREATE INDEX "Swipe_sessionId_idx" ON "Swipe"("sessionId");
