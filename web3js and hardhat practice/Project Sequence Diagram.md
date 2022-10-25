# Project Sequence Diagram
## Game Logic
1. Used coin for Egame is Egame token
2. First Registion: 
    * Caller can get free 10 wei Egame token
3. Play Game:
    * Caller can decide to use how much Egame token to play game. 
    * Caller'll get score among 100% - 500% of input Egame token amount
        * For example, caller spend 10 Egame token, he/she may get 10, 20, 30, 40 or 50 scores as result
4. Top Up Egame Token:
    * Token exchange ratio is ETH : EGame = 1 : 1

## Sequence Diagram

### Owner Set/Remove EGame Service Address in EGame Token Contract
![](https://i.imgur.com/sayYNpP.png)
### Player Register in Game
![](https://i.imgur.com/dFwiMKP.png)
### Player Play Game
![](https://i.imgur.com/Tpx1mfI.png)
### Player Top Up Egame Token
![](https://i.imgur.com/jIoSy1e.png)