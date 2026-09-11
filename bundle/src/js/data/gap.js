const WorkerCode = `
const { sqrt, atan2, cos, sin, abs, pow, PI } = Math;

const config = { playerSpeed: 0.0016, playerDecel: 0.993 };

function dist(x1,y1,x2,y2){return sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))}
function dir(x1,y1,x2,y2){return atan2(y1-y2,x1-x2)}

function collision(p,o){
    let dx=p.x-o.x,dy=p.y-o.y,r=p.scale+o.scale;
    if(abs(dx)<=r||abs(dy)<=r){
        let d=sqrt(dx*dx+dy*dy)-r;
        if(d<=0){
            let a=dir(p.x,p.y,o.x,o.y);
            p.x=o.x+r*cos(a);
            p.y=o.y+r*sin(a);
            p.xVel*=0.75;
            p.yVel*=0.75;
            return true;
        }
    }
    return false;
}

function update(p,objects,delta,spdMult){
    let vx=cos(p.moveDir||0),vy=sin(p.moveDir||0);
    let l=sqrt(vx*vx+vy*vy)||1;
    p.xVel+=vx/l*config.playerSpeed*spdMult*delta;
    p.yVel+=vy/l*config.playerSpeed*spdMult*delta;

    let depth=Math.min(4,Math.max(1,Math.round(dist(0,0,p.xVel*delta,p.yVel*delta)/40)));
    let t=1/depth;

    for(let i=0;i<depth;i++){
        p.x+=p.xVel*delta*t;
        p.y+=p.yVel*delta*t;
        for(let o of objects) collision(p,o);
    }

    p.xVel*=pow(config.playerDecel,delta);
    p.yVel*=pow(config.playerDecel,delta);
}

function cross(gap,angle,spdMult){
    const DELTA=1000/9;

    let p={x:500,y:500,xVel:0,yVel:0,scale:35,moveDir:PI+angle};
    let bx=500-(gap+45*2);

    let objs=[
        {x:bx,y:500-gap/2-45,scale:45},
        {x:bx,y:500+gap/2+45,scale:45}
    ];

    for(let i=0;i<10;i++) update(p,objs,DELTA,spdMult);

    let min=objs[0].y+45,max=objs[1].y-45;

    return p.x<bx-45-5 && p.y>=min-35 && p.y<=max+35;
}

onmessage=e=>{
    let { spdMult } = e.data;

    for(let gap=0;gap<=80;gap+=0.1){
        for(let a=-PI/4;a<=PI/4;a+=0.005){
            if(cross(gap,a,spdMult)){
                postMessage(gap);
                return;
            }
        }
    }
    postMessage(70);
};
`;

const url = "data:application/javascript;base64," + btoa(WorkerCode);
const wk = new Worker(url);

export function getGap(spdMult) {
    return new Promise(res => {
        wk.onmessage = e => res(e.data);
        wk.postMessage({ spdMult });
    });
}