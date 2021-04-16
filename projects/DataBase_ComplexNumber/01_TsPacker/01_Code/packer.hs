{-# OPTIONS_GHC -fno-warn-tabs #-}
{-# LANGUAGE ScopedTypeVariables #-}


import System.Environment
import System.Directory
import Data.List
import Control.Applicative
--import Data.Sort



main = do 
	args <- getArgs
	if length args /= 2 
		then putStr "Argument count != 2" 
 		else do 
			let buildSettingsFile = args !! 0 
			let resultFile = args !! 1 
			fileList :: [String] <- (pure read) <*> readFile buildSettingsFile
			print fileList
			fileContentList <- flip mapM fileList $ \f -> do  
				content <- readFile f
 				return $ "\n\n// " ++ f ++ "\n" ++ content
			
			let resultContent = concat fileContentList
			writeFile resultFile resultContent
			putStr "Completed"

