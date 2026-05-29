// 最小 Cocos Creator 3.x 类型声明桩
// 用于在编辑器外运行 tsc --noEmit 语法检查
// 仅声明本项目实际使用的 API

declare module 'cc' {
    export const _decorator: {
        ccclass: (name?: string) => ClassDecorator;
        property: (options?: Record<string, unknown>) => PropertyDecorator;
    };

    export class Component {
        node: Node;
        // Cocos Creator 会在运行时注入这些属性
        [key: string]: any;
    }

    export class Node {
        constructor(name?: string);

        name: string;
        parent: Node | null;
        children: Node[];
        active: boolean;

        getPosition(): { x: number; y: number; z: number };
        setPosition(x: number | { x: number; y: number; z: number }, y?: number, z?: number): void;
        getScale(): { x: number; y: number; z: number };
        setScale(x: number | { x: number; y: number; z: number }, y?: number, z?: number): void;
        addChild(child: Node): void;
        removeAllChildren(): void;
        removeFromParent(): void;
        getChildByName(name: string): Node | null;
        getComponent<T>(classConstructor: new (...args: any[]) => T): T | null;
        getComponent(className: string): any;
        getComponentInChildren<T>(classConstructor: new (...args: any[]) => T): T | null;
        addComponent<T>(classConstructor: new (...args: any[]) => T): T;
        destroy(): void;
        on(type: string, callback: Function, target?: any): void;
        off(type: string, callback: Function, target?: any): void;
        once(type: string, callback: Function, target?: any): void;
        emit(type: string, ...args: any[]): void;
        isValid: boolean;

        static EventType: {
            TOUCH_START: string;
            TOUCH_MOVE: string;
            TOUCH_END: string;
            TOUCH_CANCEL: string;
        };
    }

    export class EventTouch {
        getLocation(): { x: number; y: number };
        getLocationInView(): { x: number; y: number };
        touch: any;
    }

    export class Prefab {
        // 预制体（编辑器绑定使用）
    }

    export class SpriteFrame {
        // 精灵帧资源
    }

    export class Sprite extends Component {
        spriteFrame: SpriteFrame | null;
        color: Color;
        sizeMode: number;
        type: number;
        fillCenter: boolean;
        fillRange: number;
        fillStart: number;
        trim: boolean;
    }

    export class Label extends Component {
        string: string;
        fontSize: number;
        lineHeight: number;
        color: Color;
    }

    export class Button extends Component {
        interactable: boolean;
        transition: number;
        target: Node | null;
        clickEvents: any[];

        static EventType: {
            CLICK: string;
        };
    }

    export class UITransform extends Component {
        width: number;
        height: number;
        setContentSize(width: number, height: number): void;
        contentSize: { width: number; height: number };
    }

    export class Color {
        constructor(r?: number, g?: number, b?: number, a?: number);
        r: number;
        g: number;
        b: number;
        a: number;
        clone(): Color;
        static WHITE: Color;
        static BLACK: Color;
        static RED: Color;
        static GREEN: Color;
        static BLUE: Color;
        static YELLOW: Color;
        static CYAN: Color;
        static MAGENTA: Color;
        static GRAY: Color;
    }

    export class Vec3 {
        constructor(x?: number, y?: number, z?: number);
        x: number;
        y: number;
        z: number;
        clone(): Vec3;
        static ZERO: Vec3;
        static ONE: Vec3;
        static UP: Vec3;
    }

    export class Vec2 {
        constructor(x?: number, y?: number);
        x: number;
        y: number;
    }

    export class Size {
        constructor(width?: number, height?: number);
        width: number;
        height: number;
    }

    export class Rect {
        constructor(x?: number, y?: number, width?: number, height?: number);
        x: number;
        y: number;
        width: number;
        height: number;
    }

    export function instantiate(original: Prefab): Node;
    export function instantiate<T extends Node>(original: T): T;

    export namespace resources {
        function load<T>(path: string, type: new (...args: any[]) => T, callback: (err: Error | null, asset: T) => void): void;
        function loadDir<T>(path: string, type: new (...args: any[]) => T, callback: (err: Error | null, assets: T[]) => void): void;
    }

    export function tween(target: Node | Vec3 | any): Tween<any>;

    export const director: {
        addPersistRootNode(node: Node): void;
        loadScene(name: string): void;
    };

    export interface Tween<T> {
        to(duration: number, props: Record<string, any>, opts?: any): Tween<T>;
        by(duration: number, props: Record<string, any>, opts?: any): Tween<T>;
        set(props: Record<string, any>): Tween<T>;
        delay(duration: number): Tween<T>;
        call(callback: () => void): Tween<T>;
        sequence(...tweens: Tween<T>[]): Tween<T>;
        parallel(...tweens: Tween<T>[]): Tween<T>;
        union(): Tween<T>;
        repeat(times: number): Tween<T>;
        repeatForever(): Tween<T>;
        start(): Tween<T>;
        stop(): Tween<T>;
        clone(target: T): Tween<T>;
        then(other: Tween<T>): Tween<T>;
        tag(tag: any): Tween<T>;
        target: T;
    }
}
