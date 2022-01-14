import { BoardState, Coordinates, Pawn, Player } from "../types/board";
import { PawnWithAvailableMoves } from "../types/minimax";
import { dropShapes } from "../types/shapes";
import FieldHelper from "./FieldHelper";
import ShapesHelper from "./ShapesHelper";

export default class {
  public static dropShapes(boardState: BoardState, player: Player): dropShapes {
    const numberOfPawns: number = FieldHelper.amountOfPlayerPawnsOnBoard(
      player,
      boardState
    );

    if (numberOfPawns === 0) return this.dropFirstPawn(boardState);

    const myPawnsOnBoard = FieldHelper.getPlayerPawnsFromBoard(
      player,
      boardState
    );

    // if (myPawnsOnBoard.length > 2) {
    // 1) patrzysz na pionki jakie masz:
    // const myPawnsWithDirections = FieldHelper.getMovablePawnWithAvailableDirections(
    //   myPawnsOnBoard,
    //   boardState
    // );
    // let pawnsWithMostMoves = [] as PawnWithAvailableMoves[];
    // let currentMostMoves = 0;
    // myPawnsWithDirections.forEach((pawn) => {
    //   if (pawn.directions.length > currentMostMoves) {
    //     pawnsWithMostMoves = [];
    //     currentMostMoves = pawn.directions.length;
    //     pawnsWithMostMoves.push(pawn);
    //   } else if (pawn.directions.length == currentMostMoves) {
    //     pawnsWithMostMoves.push(pawn);
    //   }
    // });
    // if (
    //   pawnsWithMostMoves.length == 0 ||
    //   pawnsWithMostMoves[0].directions.length == 0
    // )
    // }

    // #4 a) Dostawiam pionka w pierwszym możliwym mniej oddalonym
    const position = ShapesHelper.dropNearby(myPawnsOnBoard, boardState);
    return { position: position };

    // 1. Rozstawienie pierwszego pionka, środke/ losowo
    // 2. Drugi krok, tu już algorytm, albo doklejenie pionka
    // 3. Algorytm:
    //    1) patrzysz na pionki jakie masz:
    //        a) szukasz takich w rzędzie, albo po ukosie
    //        b) sprawdzasz, czy masz miejsce na dostawienie trzeciego (biorąc pod uwagę groźbę 4 w rzędzie), zapisujesz opcje
    //    2) patrzysz na pionki przeciwnika:
    //        a) szukasz takich w rzędzie, albo po ukosie
    //        b) sprawdzasz, czy masz miejsce na dostawienie trzeciego (biorąc pod uwagę groźbę 4 w rzędzie)
    //        c) jeśli ma, zapisujesz miejsce w którym pionek ten zdobyłby punkt
    //    3) Sprawdzasz czy któreś z waszych docelowych miejsc postawienia piona się pokrywają:
    //        a) jeśli jedeno, to go wybierasz i przechodzisz dalej
    //        b) jeśli więcej niż jeden, wybierasz ten średnio bliższy do pozostałych twoich pionków(Manhattan)
    //        c) jeśli nie ma pokrycia, dostawiasz pionek możliwie najdalej od pozostałych pionków swoich/przeciwnika(Manhattan)
    //    4) Jeśli żadne z powyższych nie występuje:
    //        a) dostaw pionka w pierwszym możliwym najmniej oddalonym
  }

  //

  //

  //

  //

  static dropFirstPawn(boardState: Pawn[][]): dropShapes {
    const emptyFields: Coordinates[] = this.getEmptyCentralFields(boardState);
    if (emptyFields.length)
      return {
        position:
          emptyFields[FieldHelper.randomIntFromInterval(0, emptyFields.length)],
        value: 0,
      };
  }

  static getEmptyCentralFields(boardState: Pawn[][]): Coordinates[] {
    const copiedBoardState: Pawn[][] = FieldHelper.deepCopyItem(boardState);

    const coordinatesToCheck: Coordinates[] = FieldHelper.boardCentralCoordinates();
    const emptyFields: Coordinates[] = [];

    coordinatesToCheck.forEach((coordinate) => {
      if (!copiedBoardState[coordinate.rowIndex][coordinate.columnIndex].player)
        emptyFields.push(coordinate);
    });
    return emptyFields;
  }
}