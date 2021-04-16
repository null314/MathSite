data Color = Black | White deriving (Show, Eq)

type State = [Color]

fullState :: [State]
fullState = do 
    c1 <- [Black, White]
    c2 <- [Black, White]
    c3 <- [Black, White]
    return [c1, c2, c3]

type StateInfo a = State -> a

stateInfoColor :: Int -> StateInfo Color
stateInfoColor i state = state !! i 

stateInfoAnyWhite :: StateInfo Bool 
stateInfoAnyWhite state = or $ map (\c -> c == White) state  



-- ===================


type Knowledge = State -> (State -> Bool)


knowledgeAbout :: (Eq a) => StateInfo a -> Knowledge 
knowledgeAbout stateInfo state = let info = stateInfo state in \s -> stateInfo s == info 


knowledgeIsTrue :: StateInfo Bool -> Knowledge 
knowledgeIsTrue si _ state = si state 


knowledgeAboutColor1 :: Knowledge  
knowledgeAboutColor1 = knowledgeAbout $ stateInfoColor 0

knowledgeAboutColor2 :: Knowledge  
knowledgeAboutColor2 = knowledgeAbout $ stateInfoColor 1

knowledgeAboutColor3 :: Knowledge  
knowledgeAboutColor3 = knowledgeAbout $ stateInfoColor 2

-- ===================


knowledgeAnd :: [Knowledge] -> Knowledge
knowledgeAnd list stateTrue = \s -> and $ map (\f -> f stateTrue s) list    

stateInfoList :: [StateInfo a] -> StateInfo [a]
stateInfoList sil state = map (\si-> si state) sil 

knowledgeImply :: Knowledge -> Knowledge -> StateInfo Bool
knowledgeImply knowledge1 knowledge2 state = and $ map (\(b1, b2) -> not $ and [b1, not b2]) $ map (\s -> (knowledge1 state s, knowledge2 state s)) fullState   

-- ==================

   
type KnowledgeList = [(Knowledge, Knowledge)]


insightList :: KnowledgeList -> StateInfo [Bool]
insightList knowledgeList = stateInfoList $ map knowledgeInsight knowledgeList 


knowledgeInsight :: (Knowledge, Knowledge) -> StateInfo Bool
knowledgeInsight (currentKnowledge, targetKnowledge) = knowledgeImply currentKnowledge targetKnowledge


manStart_1 = knowledgeAnd [knowledgeAboutColor2, knowledgeAboutColor3, knowledgeAbout stateInfoAnyWhite]
manStart_2 = knowledgeAnd [knowledgeAboutColor1, knowledgeAboutColor3, knowledgeAbout stateInfoAnyWhite]
manStart_3 = knowledgeAnd [knowledgeAboutColor1, knowledgeAboutColor2, knowledgeAbout stateInfoAnyWhite]


knowledgeList_1 :: KnowledgeList
knowledgeList_1 = [(manStart_1, knowledgeAboutColor1), (manStart_2, knowledgeAboutColor2), (manStart_3, knowledgeAboutColor3)]


insightList_1 :: StateInfo [Bool]
insightList_1 = insightList knowledgeList_1 


-- ===============

addNewKnowledge :: Knowledge -> KnowledgeList -> KnowledgeList 
addNewKnowledge newKnowledge knowledgeList = flip map knowledgeList $ \(oldKnowledge, targetKnowledge) -> (knowledgeAnd [oldKnowledge, newKnowledge], targetKnowledge)   


knowledgeList_2 :: KnowledgeList
knowledgeList_2 = addNewKnowledge (knowledgeAbout insightList_1) knowledgeList_1      



insightList_2 :: StateInfo [Bool]
insightList_2 = insightList knowledgeList_2

knowledgeList_3 :: KnowledgeList
knowledgeList_3 = addNewKnowledge (knowledgeAbout insightList_2) knowledgeList_2      

insightList_3 :: StateInfo [Bool]
insightList_3 = insightList knowledgeList_3

-- =============

startState = [White, White, White] 

main = do  
	putStr $ "day 1 result: " ++ (show $ insightList_1 startState) ++ "\n" 
	putStr $ "day 2 result: " ++ (show $ insightList_2 startState) ++ "\n"
	putStr $ "day 3 result: " ++ (show $ insightList_3 startState) ++ "\n"