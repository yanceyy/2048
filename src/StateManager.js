import {
    matrixHorizontalFlip,
    matrixLeftRotate90,
    matrixRightRotate90,
} from "./utils.js";

export default class StateManager {
    state;
    score = 0;
    cards = new Map();
    values = new Map();
    mergedNode = new Map();
    addedNode = new Set();

    constructor(size = 4) {
        this.size = size;
        this.reset();
    }

    // generate a random id for a new card component
    getId = (() => {
        let id = 1;
        return () => {
            return id++;
        };
    })();

    reset() {
        this.state = Array.from({ length: this.size }, () =>
            Array.from({ length: this.size }, () => 0)
        );
        this.score = 0;
        this.cards.clear();
        this.values.clear();
        this.mergedNode.clear();
        this.addedNode.clear();
    }

    isGameOver() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.state[i][j] === 0) {
                    return false;
                }
            }
        }

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size - 1; j++) {
                const id = this.state[i][j];
                if (
                    this.values.get(id) ===
                    this.values.get(this.state[i][j + 1])
                ) {
                    return false;
                }
            }
        }

        for (let j = 0; j < this.size; j++) {
            for (let i = 0; i < this.size - 1; i++) {
                const id = this.state[i][j];
                if (
                    this.values.get(id) ===
                    this.values.get(this.state[i + 1][j])
                ) {
                    return false;
                }
            }
        }

        return true;
    }

    /*
     * It calculates the next position of the card by pushing all the nodes to the left
     */
    move() {
        this.mergedNode.clear();
        this.addedNode.clear();
        let hasChanged = false;
        // move all the nodes next to each other to the left
        for (let row = 0; row < this.size; row++) {
            let left = 0,
                right = 1;
            while (left < right && right < this.size) {
                if (this.state[row][left] !== 0) {
                    left++;
                    right++;
                } else if (
                    this.state[row][left] === 0 &&
                    this.state[row][right] !== 0
                ) {
                    this.state[row][left] = this.state[row][right];
                    this.state[row][right] = 0;
                    left++;
                    right++;
                    hasChanged = true;
                } else {
                    right++;
                }
            }
        }

        // Merge the first connected nodes if they are the same and move the rest of the nodes to the left
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size - 1; col++) {
                const id1 = this.state[row][col];
                const id2 = this.state[row][col + 1];
                if (id1 === 0 || id2 === 0) {
                    continue;
                }
                const value1 = this.values.get(id1);
                const value2 = this.values.get(id2);
                if (value1 === value2) {
                    this.mergedNode.set(id2, id1);
                    this.addedNode.add(id1);
                    this.values.set(id1, value1 * 2);
                    this.values.set(id2, 0);
                    hasChanged = true;
                    this.score += value1 * 2;
                    col++;
                    while (col < this.size - 1) {
                        this.state[row][col] = this.state[row][col + 1];
                        col++;
                    }
                    this.state[row][col] = 0;
                    break;
                }
            }
        }
        return hasChanged;
    }

    moveLeft() {
        return this.move();
    }

    moveRight() {
        // Rather than implementing the moveRight function, we can just flip the matrix horizontally and call moveLeft
        this.state = matrixHorizontalFlip(this.state);
        const changed = this.move();
        this.state = matrixHorizontalFlip(this.state);
        return changed;
    }

    moveUp() {
        // Rather than implementing the moveUp function, we can just rotate the matrix 90 degrees to the left and call moveLeft
        this.state = matrixLeftRotate90(this.state);
        const changed = this.move();
        this.state = matrixRightRotate90(this.state);
        return changed;
    }

    moveDown() {
        // Rather than implementing the moveDown function, we can just rotate the matrix 90 degrees to the right and call moveLeft
        this.state = matrixRightRotate90(this.state);
        const changed = this.move();
        this.state = matrixLeftRotate90(this.state);
        return changed;
    }

    randomGetEmptySlotPosition() {
        const emptySlots = [];
        this.state.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if (!col) {
                    emptySlots.push({ x: colIndex, y: rowIndex });
                }
            });
        });
        const randomIndex = Math.floor(Math.random() * emptySlots.length);
        return emptySlots[randomIndex];
    }

    generateRandomIdAndPosition() {
        const position = this.randomGetEmptySlotPosition();
        const id = this.getId();
        this.values.set(id, 2);
        this.state[position.y][position.x] = id;
        return [id, position];
    }
}
