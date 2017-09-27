import Rtl from './Rtl';

/**
 * @class
 */
class Snake {
  /**
   * @constructor
   */
  constructor(options = { size: 10, spread: 2, color: '#000' }) {
    this.handleKeyboardEvent = this.handleKeyboardEvent.bind(this);

    const defaultOptitons = Snake.getDefaultOptions();
    const instances = Snake.getInstances();

    Object.assign(this, defaultOptitons, options, instances);
    this.bindKeyboardEvent();
  }

  /**
   * @method
   */
  static getDefaultOptions() {
    return {
      size: 10,
      spread: 2,
      color: '#000',
      context: null,
      actions: null,
    };
  }

  /**
   * @static
   * @method
   */
  static getInstances() {
    return {
      status: false,
      requestID: -1,
      boundary: null,
      motionOperate: null,
      rtl: Rtl.None,
      length: 1,
      body: [
        {
          x: 0,
          y: 0,
        },
      ],
    };
  }

  /**
   * @method
   */
  static boundaryDetection({ size, boundary, location }) {
    const {
      width,
      height,
    } = boundary;
    const {
      x,
      y,
    } = location;
    const top = 0;
    const right =  width - size;
    const bottom = height - size;
    const left = 0;
    let flag = false;
    if ((x <= right && x >= left) && (y <= bottom && y >= top)) {
      flag = true
    }
    return flag;
  }

  /**
   * @method
   */
  move() {
    const {
      body: [location],
    } = this;
    const {
      x,
      y,
    } = location;
    this.actions.moveSnake({ x, y });
  }

  /**
   * @method
   */
  mapStateToProps(state) {
    const {
      boundary,
      snake: {
        rtl,
        size,
        body,
      },
    } = state.toJS();
    const [location] = body;
    this.setRtl(rtl);
    this.setSize(size);
    if (Snake.boundaryDetection({ boundary, size, location })) {
      this.clear();
      this.setBody(body);
      this.draw();
    } else {
      const {
        body,
      } = this;
      this.actions.restoreSnake({ body });
    }
  }

  /**
   * @method
   */
  setBody(body) {
    this.body = body;
  }

  /**
   * @method
   */
  setSize(size) {
    if (this.size !== size) {
      this.size = size;
    }
  }

  /**
   * @method
   */
  isRev(rtl) {
    const {
      body: {
        length,
      },
    } = this;
    let flag = false;
    if ((length > 1) && (rtl === Rtl.rev(this.rtl))) {
      flag = true;
    }
    return flag;
  }

  /**
   * @method
   */
  getMotionOperate() {
    const {
      spread,
      rtl,
      body: [location],
    } = this;
    let {
      x,
      y,
    } = location;
    let motionOperate = null;
    switch (rtl) {
      case Rtl.Down:
        motionOperate = () => {
          const delta = {
            x: 0,
            y: spread,
          };
          this.actions.moveSnake(delta);
        }
        break;
      case Rtl.Left:
        motionOperate = () => {
          const delta ={
            x: -spread,
            y: 0,
          };
          this.actions.moveSnake(delta);
        }
        break;
      case Rtl.Up:
        motionOperate = () => {
          const delta = {
            x: 0,
            y: -spread,
          };
          this.actions.moveSnake(delta);
        }
        break;
      case Rtl.Right:
        motionOperate = () => {
          const delta = {
            x: spread,
            y: 0,
          };
          this.actions.moveSnake(delta);
        }
        break;
    }
    return motionOperate;
  }

  /**
   * @method
   */
  translate(rtl) {
    if ((rtl !== Rtl.None) && (!this.isRev(rtl))) {
      this.actions.translateSnake({ rtl });
    }
  }

  /**
   * @method
   */
  setRtl(rtl) {
    if (this.rtl !== rtl) {
      this.rtl = rtl;
      this.motionOperate = this.getMotionOperate();

      this.cancelMotionAnimation();
      this.requestMotionAnimation();
    }
  }

  /**
   * @method
   */
  removeKeyboardEvent() {
    window.removeEventListener('keydown', this.handleKeyboardEvent);
  }

  /**
   * @method
   */
  bindKeyboardEvent() {
    window.addEventListener('keydown', this.handleKeyboardEvent);
  }

  /**
   * @method
   */
  handleKeyboardEvent(event) {
    const {
      code,
    } = event;
    const rtl = Rtl.fromCode(code);
    this.translate(rtl);
  }

  /**
   * @method
   */
  reset() {
    this.cancelMotionAnimation();
    this.clear();
    this.bindKeyboardEvent();
  }

  /**
   * @method
   */
  clear() {
    const {
      size,
      body,
    } = this;
    body.forEach((location) => {
      const {
        x,
        y,
      } = location;
      this.context.clearRect(x, y, size, size);
    });
  }

  /**
   * @method
   */
  pause() {
    this.removeKeyboardEvent();
    this.cancelMotionAnimation();
  }

  /**
   * @method
   */
  resume() {
    this.requestMotionAnimation();
    this.bindKeyboardEvent();
  }

  /**
   * @method
   */
  draw() {
    const {
      size,
      color,
      body,
    } = this;
    body.forEach((location) => {
      const {
        x,
        y,
      } = location;
      this.fillStyle = color;
      this.context.fillRect(x, y, size, size);
    });
  }

  /**
   * @method
   */
  moveStep() {
    if (this.motionOperate != null) {
      this.motionOperate();
    }
  }

  /**
   * @method
   */
  requestMotionAnimation() {
    const step = () => {
      if (!this.status) {
        this.moveStep();
        this.requestID = requestAnimationFrame(step);
      }
    };
    this.status = false;
    this.requestID = requestAnimationFrame(step);
  }

  /**
   * @method
   */
  cancelMotionAnimation() {
    const {
      requestID,
    } = this;
    if (requestID !== -1) {
      cancelAnimationFrame(requestID);
    }
    this.status = true;
  }
}

export default Snake;
