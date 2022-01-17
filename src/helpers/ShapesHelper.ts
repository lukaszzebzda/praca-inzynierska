import { BoardState, Coordinates } from "../types/board";
import { Pawn } from "../types/board";
import FieldHelper from "./FieldHelper";
import PlayerScoreHelper from "./PlayerScoreHelper";

export default class {
  static checkMediumDistancePossibilities(
    pair: Pawn[],
    boardState: BoardState
  ): { coordinates: Coordinates[] } {
    if (
      pair[0].currentPosition.rowIndex == pair[1].currentPosition.rowIndex ||
      pair[0].currentPosition.columnIndex == pair[1].currentPosition.columnIndex
    ) {
      const options = this.checkNeedlePositionPerpendicularly(pair, boardState);
      return { coordinates: options };
    }
    const options = this.checkNeedlePositionDiagonally(pair, boardState);
    return { coordinates: options };
  }

  static checkCloseDistancePossibilities(
    pair: Pawn[],
    boardState: BoardState
  ): {
    coordinates: Coordinates[];
  } {
    // 1. Sprawdzamy występowanie hairpoona dwustronnie
    //    a) czy sprawdzamy pionowe czy poziome ustawienie
    //    b) czy trzecie pole jest wolne, jeśli tak sprawdź wolne wokół
    if (pair[0].currentPosition.rowIndex == pair[1].currentPosition.rowIndex) {
      const options = this.checkHarpoonPositionInRow(pair, boardState);
      return { coordinates: options };
    }
    const options = this.checkHarpoonPositionInColumn(pair, boardState);
    return { coordinates: options };
  }

  static checkHarpoonPositionInColumn(
    pair: Pawn[],
    boardState: BoardState
  ): Coordinates[] {
    let columnOptions: Coordinates[] = [];
    let lowerPawn, higherPawn;
    if (pair[0].currentPosition.rowIndex > pair[1].currentPosition.rowIndex) {
      higherPawn = pair[0];
      lowerPawn = pair[1];
    } else {
      higherPawn = pair[1];
      lowerPawn = pair[0];
    }
    const highHarpoonOptions = this.checkHighHarpoon(higherPawn, boardState);
    const lowHarpoonOptions = this.checkLowHarpoon(lowerPawn, boardState);
    columnOptions = columnOptions.concat(highHarpoonOptions, lowHarpoonOptions);

    return columnOptions;
  }

  static checkLowHarpoon(
    lowerPawn: Pawn,
    boardState: BoardState
  ): Coordinates[] {
    const lowHarpoonOptions: Coordinates[] = [];

    const scoreFieldCords = {
      rowIndex: lowerPawn.currentPosition.rowIndex - 1,
      columnIndex: lowerPawn.currentPosition.columnIndex,
    };
    const isScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      scoreFieldCords,
      boardState
    );
    if (!isScoreFieldEmpty) return [];

    const possibleFourthPawnInRow = {
      rowIndex: lowerPawn.currentPosition.rowIndex - 2,
      columnIndex: lowerPawn.currentPosition.columnIndex,
    };
    const isFourthPawnBlocking = FieldHelper.isThisPlayerField(
      possibleFourthPawnInRow,
      lowerPawn.player,
      boardState
    );
    if (isFourthPawnBlocking) return [];

    const scoreToLeftCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex - 1,
    };
    const scoreToDownCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex - 1,
      columnIndex: scoreFieldCords.columnIndex,
    };
    const scoreToRightCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex + 1,
    };

    const isLeftFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToLeftCords,
      lowerPawn.player,
      boardState
    );
    if (isLeftFieldSuitableToDrop) lowHarpoonOptions.push(scoreToLeftCords);

    const isDownFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToDownCords,
      lowerPawn.player,
      boardState
    );
    if (isDownFieldSuitableToDrop) lowHarpoonOptions.push(scoreToDownCords);

    const isRightFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToRightCords,
      lowerPawn.player,
      boardState
    );
    if (isRightFieldSuitableToDrop) lowHarpoonOptions.push(scoreToRightCords);

    return lowHarpoonOptions;
  }

  static checkHighHarpoon(
    higherPawn: Pawn,
    boardState: BoardState
  ): Coordinates[] {
    const highHarpoonOptions: Coordinates[] = [];

    const scoreFieldCords = {
      rowIndex: higherPawn.currentPosition.rowIndex + 1,
      columnIndex: higherPawn.currentPosition.columnIndex,
    };
    const isScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      scoreFieldCords,
      boardState
    );
    if (!isScoreFieldEmpty) return [];

    const possibleFourthPawnInRow = {
      rowIndex: higherPawn.currentPosition.rowIndex + 2,
      columnIndex: higherPawn.currentPosition.columnIndex,
    };
    const isFourthPawnBlocking = FieldHelper.isThisPlayerField(
      possibleFourthPawnInRow,
      higherPawn.player,
      boardState
    );
    if (isFourthPawnBlocking) return [];

    const scoreToLeftCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex - 1,
    };
    const scoreToTopCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex + 1,
      columnIndex: scoreFieldCords.columnIndex,
    };
    const scoreToRightCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex + 1,
    };

    const isLeftFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToLeftCords,
      higherPawn.player,
      boardState
    );
    if (isLeftFieldSuitableToDrop) highHarpoonOptions.push(scoreToLeftCords);

    const isTopFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToTopCords,
      higherPawn.player,
      boardState
    );
    if (isTopFieldSuitableToDrop) highHarpoonOptions.push(scoreToTopCords);

    const isRightFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToRightCords,
      higherPawn.player,
      boardState
    );
    if (isRightFieldSuitableToDrop) highHarpoonOptions.push(scoreToRightCords);

    return highHarpoonOptions;
  }

  static checkHarpoonPositionInRow(pair: Pawn[], boardState: BoardState) {
    let rowOptions: Coordinates[] = [];
    let leftPawn, rightPawn;
    if (
      pair[0].currentPosition.columnIndex > pair[1].currentPosition.columnIndex
    ) {
      rightPawn = pair[0];
      leftPawn = pair[1];
    } else {
      rightPawn = pair[1];
      leftPawn = pair[0];
    }
    const leftHarpoonOptions = this.checkLeftHarpoon(leftPawn, boardState);
    const rightHarpoonOptions = this.checkRightHarpoon(rightPawn, boardState);
    rowOptions = rowOptions.concat(leftHarpoonOptions, rightHarpoonOptions);

    return rowOptions;
  }

  static checkLeftHarpoon(
    leftPawn: Pawn,
    boardState: BoardState
  ): Coordinates[] {
    const leftHarpoonOptions: Coordinates[] = [];

    const scoreFieldCords = {
      rowIndex: leftPawn.currentPosition.rowIndex,
      columnIndex: leftPawn.currentPosition.columnIndex - 1,
    };
    const isScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      scoreFieldCords,
      boardState
    );
    if (!isScoreFieldEmpty) return [];

    const possibleFourthPawnInRow = {
      rowIndex: leftPawn.currentPosition.rowIndex,
      columnIndex: leftPawn.currentPosition.columnIndex - 2,
    };
    const isFourthPawnBlocking = FieldHelper.isThisPlayerField(
      possibleFourthPawnInRow,
      leftPawn.player,
      boardState
    );
    if (isFourthPawnBlocking) return [];

    const scoreToDownCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex - 1,
      columnIndex: scoreFieldCords.columnIndex,
    };
    const scoreToLeftCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex - 1,
    };
    const scoreToTopCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex + 1,
      columnIndex: scoreFieldCords.columnIndex,
    };

    const isDownFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToDownCords,
      leftPawn.player,
      boardState
    );
    if (isDownFieldSuitableToDrop) leftHarpoonOptions.push(scoreToDownCords);

    const isLeftFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToLeftCords,
      leftPawn.player,
      boardState
    );
    if (isLeftFieldSuitableToDrop) leftHarpoonOptions.push(scoreToLeftCords);

    const isTopFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToTopCords,
      leftPawn.player,
      boardState
    );
    if (isTopFieldSuitableToDrop) leftHarpoonOptions.push(scoreToTopCords);

    return leftHarpoonOptions;
  }

  static checkRightHarpoon(
    rightPawn: Pawn,
    boardState: BoardState
  ): Coordinates[] {
    const rightHarpoonOptions: Coordinates[] = [];

    const scoreFieldCords = {
      rowIndex: rightPawn.currentPosition.rowIndex,
      columnIndex: rightPawn.currentPosition.columnIndex + 1,
    };
    const isScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      scoreFieldCords,
      boardState
    );
    if (!isScoreFieldEmpty) return [];

    const possibleFourthPawnInRow = {
      rowIndex: rightPawn.currentPosition.rowIndex,
      columnIndex: rightPawn.currentPosition.columnIndex + 2,
    };
    const isFourthPawnBlocking = FieldHelper.isThisPlayerField(
      possibleFourthPawnInRow,
      rightPawn.player,
      boardState
    );
    if (isFourthPawnBlocking) return [];

    const scoreToDownCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex - 1,
      columnIndex: scoreFieldCords.columnIndex,
    };
    const scoreToRightCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex + 1,
    };
    const scoreToTopCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex + 1,
      columnIndex: scoreFieldCords.columnIndex,
    };

    const isDownFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToDownCords,
      rightPawn.player,
      boardState
    );
    if (isDownFieldSuitableToDrop) rightHarpoonOptions.push(scoreToDownCords);

    const isRightFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToRightCords,
      rightPawn.player,
      boardState
    );
    if (isRightFieldSuitableToDrop) rightHarpoonOptions.push(scoreToRightCords);

    const isTopFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToTopCords,
      rightPawn.player,
      boardState
    );
    if (isTopFieldSuitableToDrop) rightHarpoonOptions.push(scoreToTopCords);

    return rightHarpoonOptions;
  }

  static dropNearby(
    myPawnsOnBoard: Pawn[],
    boardState: BoardState
  ): Coordinates {
    let [xSum, ySum] = [0, 0];
    const cordsAmount = myPawnsOnBoard.length;

    myPawnsOnBoard.forEach((pawn) => {
      xSum += pawn.currentPosition.rowIndex;
      ySum += pawn.currentPosition.columnIndex;
    });

    const [xCenter, yCenter] = [
      Math.round(xSum / cordsAmount),
      Math.round(ySum / cordsAmount),
    ];

    if (!boardState[xCenter][yCenter].player)
      return { rowIndex: xCenter, columnIndex: yCenter };

    const centerRing = [
      { rowIndex: xCenter + 1, columnIndex: yCenter },
      { rowIndex: xCenter + 1, columnIndex: yCenter + 1 },
      { rowIndex: xCenter, columnIndex: yCenter + 1 },
      { rowIndex: xCenter - 1, columnIndex: yCenter + 1 },
      { rowIndex: xCenter - 1, columnIndex: yCenter },
      { rowIndex: xCenter - 1, columnIndex: yCenter - 1 },
      { rowIndex: xCenter, columnIndex: yCenter - 1 },
      { rowIndex: xCenter + 1, columnIndex: yCenter - 1 },
    ] as Coordinates[];
    const emptyFieldsOnRing = FieldHelper.findEmptyFields(
      boardState,
      centerRing
    );

    const emptyLegalFieldsOnRing = emptyFieldsOnRing.filter(
      (field) =>
        !PlayerScoreHelper.isGonnaBeThirdInRow(
          {
            rowIndex: field.rowIndex,
            columnIndex: field.columnIndex,
          } as Coordinates,
          myPawnsOnBoard[0].player,
          boardState
        )
    );

    if (emptyLegalFieldsOnRing.length == 0) {
      return FieldHelper.randomLegalEmptyFieldFromBoard(
        boardState,
        myPawnsOnBoard[0].player
      );
    }

    return emptyLegalFieldsOnRing[
      Math.floor(Math.random() * emptyLegalFieldsOnRing.length)
    ];
  }
}
