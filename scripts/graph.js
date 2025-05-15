
const lineY=[]
const windowHeight=window.innerHeight;
const windowWidth=window.innerWidth;
for(let i=0;i<=windowHeight;i+=50){
    lineY.push({x:0,y:i,xTo:windowWidth})
}
function graph(){
    //non-global variables
    let height=windowHeight;
    let width=windowHeight;
    let lineColor="black";
    let lineWid="0.5";
    let fontColor="black";
    let font="10px thin"
    //Y-axis
    lineY.forEach((line)=>{
        ctx.beginPath()
        ctx.moveTo(line.x,line.y)
        ctx.lineTo(line.xTo,line.y)
        ctx.strokeStyle=lineColor
        ctx.lineWidth=lineWid;
        ctx.stroke()
        ctx.closePath()
                ctx.fillStyle=fontColor;
 ctx.font=font;
 ctx.textBaseline='top';
 ctx.fillText(line.y, 0, line.y)
        //X-Axis
        ctx.beginPath()
        ctx.moveTo(line.y,0)
        ctx.lineTo(line.y,height)
        ctx.stroke()
        ctx.closePath()
        
                        ctx.fillStyle=fontColor;
 ctx.font=font;
 ctx.textBaseline='top';
 ctx.fillText(line.y, line.y, 0)
        
    })
    //borders
    
    ctx.lineWidth=3
    ;
    ctx.moveTo(width,0)
    ctx.lineTo(width,height)
    ctx.stroke()
}



