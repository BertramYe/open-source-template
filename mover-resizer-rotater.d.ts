declare module 'mover-resizer-rotater' {
    export function initTargetContainerMoveRoateResize(elementID:string,params: object): HTMLElement;
    export function ScaledTargetContainerWithParentLabel(element:HTMLElement | null,scaledPercent: number): void;
    export function SetMoveResizeRotateParameters(element:HTMLElement | null,params: object): void;
    export function GetMoveResizeRotateParameters(elementID:HTMLElement | null): object;
}
