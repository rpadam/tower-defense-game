import './styles.css';
import { TowerDefenseGame } from './game.js';

const canvas = document.querySelector('#game-canvas');
if (!canvas) {
  throw new Error('Missing #game-canvas element');
}

const game = new TowerDefenseGame(canvas);
game.start();
