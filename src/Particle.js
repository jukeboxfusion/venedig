import { particleConfig } from "./particle-config";

export default class Particle {
    constructor(x, y, ox, oy) {
        this.pos = { x: x, y: y };
        this.oPos = { x: ox, y: oy };
        this.acc = { x: 0, y: 0 };
    }

    move(m) {
        let d, dx, dy, f, t;
        d = (dx = m.x - this.pos.x) * dx + (dy = m.y - this.pos.y) * dy;
        f = -particleConfig.THICKNESS / d;
        if (d < particleConfig.THICKNESS) {
            t = Math.atan2(dy, dx);
            this.acc.x += f * Math.cos(t);
            this.acc.y += f * Math.sin(t);
        }

        this.pos.x +=
            (this.acc.x *= particleConfig.DRAG) +
            (this.oPos.x - this.pos.x) * particleConfig.EASE;
        this.pos.y +=
            (this.acc.y *= particleConfig.DRAG) +
            (this.oPos.y - this.pos.y) * particleConfig.EASE;
    }

    getPos() {
        return this.pos;
    }
}
