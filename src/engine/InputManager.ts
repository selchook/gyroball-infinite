export interface InputState {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    space: boolean;
    enter: boolean;
    mouseX: number;
    mouseY: number;
    mouseDelta: { x: number; y: number };
    touches: TouchState[];
}

export interface TouchState {
    id: number;
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
}

export class InputManager {
    private inputState: InputState;
    private keyBindings: Map<string, keyof InputState> = new Map();
    private previousMouseX: number = 0;
    private previousMouseY: number = 0;
    private touchStates: Map<number, TouchState> = new Map();

    constructor() {
        this.inputState = {
            left: false,
            right: false,
            up: false,
            down: false,
            space: false,
            enter: false,
            mouseX: 0,
            mouseY: 0,
            mouseDelta: { x: 0, y: 0 },
            touches: []
        };

        this.setupKeyBindings();
        this.setupEventListeners();
        this.setupTouchControls();
    }

    private setupKeyBindings(): void {
        // WASD
        this.keyBindings.set('KeyW', 'up');
        this.keyBindings.set('KeyA', 'left');
        this.keyBindings.set('KeyS', 'down');
        this.keyBindings.set('KeyD', 'right');
        
        // Arrow keys
        this.keyBindings.set('ArrowUp', 'up');
        this.keyBindings.set('ArrowLeft', 'left');
        this.keyBindings.set('ArrowDown', 'down');
        this.keyBindings.set('ArrowRight', 'right');
        
        // Other keys
        this.keyBindings.set('Space', 'space');
        this.keyBindings.set('Enter', 'enter');
    }

    private setupEventListeners(): void {
        // Keyboard events
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Mouse events
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Touch events
        window.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        window.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        window.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Prevent default behaviors
        window.addEventListener('keydown', (e) => {
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        });
    }

    private setupTouchControls(): void {
        const leftButton = document.getElementById('leftButton');
        const rightButton = document.getElementById('rightButton');

        if (leftButton) {
            leftButton.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.inputState.left = true;
            });
            leftButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.inputState.left = false;
            });
        }

        if (rightButton) {
            rightButton.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.inputState.right = true;
            });
            rightButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.inputState.right = false;
            });
        }
    }

    private handleKeyDown(event: KeyboardEvent): void {
        const action = this.keyBindings.get(event.code);
        if (action && typeof action === 'string') {
            (this.inputState as any)[action] = true;
        }
    }

    private handleKeyUp(event: KeyboardEvent): void {
        const action = this.keyBindings.get(event.code);
        if (action && typeof action === 'string') {
            (this.inputState as any)[action] = false;
        }
    }

    private handleMouseMove(event: MouseEvent): void {
        this.inputState.mouseDelta.x = event.clientX - this.previousMouseX;
        this.inputState.mouseDelta.y = event.clientY - this.previousMouseY;
        
        this.inputState.mouseX = event.clientX;
        this.inputState.mouseY = event.clientY;
        
        this.previousMouseX = event.clientX;
        this.previousMouseY = event.clientY;
    }

    private handleTouchStart(event: TouchEvent): void {
        event.preventDefault();
        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            const touchState: TouchState = {
                id: touch.identifier,
                x: touch.clientX,
                y: touch.clientY,
                deltaX: 0,
                deltaY: 0
            };
            this.touchStates.set(touch.identifier, touchState);
        }
        this.updateTouchArray();
    }

    private handleTouchMove(event: TouchEvent): void {
        event.preventDefault();
        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            const touchState = this.touchStates.get(touch.identifier);
            if (touchState) {
                touchState.deltaX = touch.clientX - touchState.x;
                touchState.deltaY = touch.clientY - touchState.y;
                touchState.x = touch.clientX;
                touchState.y = touch.clientY;
            }
        }
        this.updateTouchArray();
    }

    private handleTouchEnd(event: TouchEvent): void {
        event.preventDefault();
        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            this.touchStates.delete(touch.identifier);
        }
        this.updateTouchArray();
    }

    private updateTouchArray(): void {
        this.inputState.touches = Array.from(this.touchStates.values());
    }

    getInputState(): InputState {
        return this.inputState;
    }

    isPressed(action: keyof InputState): boolean {
        const value = this.inputState[action];
        return typeof value === 'boolean' ? value : false;
    }

    // Reset mouse delta after frame
    resetMouseDelta(): void {
        this.inputState.mouseDelta.x = 0;
        this.inputState.mouseDelta.y = 0;
    }
}