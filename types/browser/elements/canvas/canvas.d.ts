export interface CanvasAdapter<C> {
    width: number;
    height: number;
    ctx?: C;
    getContext(): C;
}
