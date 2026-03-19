import './styles.css';
import { TowerDefenseGame } from './game.js';
import { bootstrapGameShell } from './game/bootstrap.js';

const canvas = document.querySelector('#game-canvas');
if (!canvas) {
  throw new Error('Missing #game-canvas element');
}

const game = new TowerDefenseGame(canvas);
bootstrapGameShell({ game, canvas });
