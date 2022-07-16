import { Component, ElementRef, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, GatewayService } from '@app/_services';
import { AlertService } from '../../alert/alert.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationDialogService } from '@app/_components/confirm-popup/popup.service';
import { HelperService } from '@app/_services/helper.service';
import { EslService } from '@app/_services/esl.service';
import "./storelayout.css"


@Component({ templateUrl: 'storelayout.html',
styleUrls: ['./storelayout.css'], })
export class StorelayoutComponent implements OnInit,AfterViewInit {
    loading = false;
    outerlayout = [];
    eslList: any;
    // @ViewChild("vfTestPointsCanvas") vfTestPointsCanvas: ElementRef;
    // ctx: CanvasRenderingContext2D;
    // canvasEl: HTMLCanvasElement;
    @ViewChild('myCanvas', {static: false}) myCanvas: ElementRef;
     ctx = null;
   boxes = [
    { x: 200, y: 220, w: 100, h: 50 },
    { x: 100, y: 120, w: 100, h: 50 },
    { x: 100, y: 120, w: 100, h: 50 },
    { x: 100, y: 100, w: 50, h: 50 },
  ];
  cube = [
    { x: 250, y: 20,},
    // { x: 100, y: 120, w: 100, h: 50 },
    // { x: 100, y: 120, w: 100, h: 50 },
    // { x: 100, y: 100, w: 50, h: 50 },
  ];
   isDown = false;
   dragTarget = null;
   startX = null;
   startY = null;
    constructor(
        private router: Router,
        private eslService: EslService,
        route: ActivatedRoute,
        private spinner: NgxSpinnerService,

    ) {
    }

    ngAfterViewInit(){
        const canvasEle = this.myCanvas.nativeElement;
        
        canvasEle.width = canvasEle.clientWidth;
        canvasEle.height = canvasEle.clientHeight;
    
        // get context of the canvas
        this.ctx = canvasEle.getContext('2d');

        this.draw();
         
        
    }

    drawPolygon(x,y) {
        // Retrieve the user input for the polygon
        var numSides = 6;
        var radius = 20;
        // Get our canvas center point to center the polygon
        var xCenter = x;
        var yCenter = y;
        // Clear the canvas
        
        // Begin our path
        this.ctx.beginPath();
        // Map the first vertice to start with
        var xPos = xCenter + radius * Math.cos(2 * Math.PI * 0 / numSides);
        var yPos = yCenter + radius * Math.sin(2 * Math.PI * 0 / numSides);
        this.ctx.moveTo(xPos,yPos);
        // Loop through the vertices and map the lines
        for (let i = 1; i <= numSides; i++) {
        // Determine the coordinates of the next vertex
        xPos = xCenter + radius * Math.cos(2 * Math.PI * i / numSides);
        yPos = yCenter + radius * Math.sin(2 * Math.PI * i / numSides);
        // Set line to the next vertex
        this.ctx.lineTo(xPos,yPos);
        }
        // Close our path of lines
        this.ctx.closePath();
        // Set the line properties and draw the lines
        this.ctx.lineWidth = 2;
        this.ctx.lineJoin = 'round';
        this.ctx.stroke();
        // Fill our new polygon
        this.ctx.fillStyle = '#00F';
        this.ctx.fill();
        }
    ngOnInit() {
        
        this.getEslList();
        const canvas = document.querySelector('canvas')
        const ctx = canvas.getContext("2d");
        // ctx.moveTo(0, 0);
        // ctx.lineTo(200, 100);
        // ctx.stroke();
        // canvas.addEventListener('mousedown', (e) => {
        //     this.getCursorPosition(canvas, e);
        // });
        // this.drawGrid(970,400,canvas)
    }

    draw = () => {
        
        this.ctx.clearRect(
          0,
          0,
          this.myCanvas.nativeElement.clientWidth,
          this.myCanvas.nativeElement.clientHeight
        );
        this.boxes.map((info) => this.drawFillRect(info));
        this.cube.map((info) => this.drawPolygon(info.x,info.y));
        // this.drawPolygon();
      };

      drawFillRect = (info, style = {}) => {
        const { x, y, w, h } = info;
        // const { backgroundColor = 'black' } = style;
    
        this.ctx.beginPath();
        this.ctx.fillStyle = "#FF0000";;
        this.ctx.fillRect(x, y, w, h);
      };

    handleMouseDown (event: MouseEvent){
        this.startX = event.offsetX - this.myCanvas.nativeElement.clientLeft;
        this.startY = event.offsetY - this.myCanvas.nativeElement.clientTop;
        this.isDown = this.hitBox(this.startX, this.startY);
    }
    handleMouseMove (event: MouseEvent){
        if (!this.isDown) return;
        console.log(event.offsetX , this.myCanvas.nativeElement.clientLeft,event.offsetX - this.myCanvas.nativeElement.clientLeft)

    const mouseX = event.offsetX - this.myCanvas.nativeElement.clientLeft;
    const mouseY = event.offsetY - this.myCanvas.nativeElement.clientTop;
    const dx = mouseX - this.startX;
    const dy = mouseY - this.startY;
    this.startX = mouseX;
    this.startY = mouseY;
    this.dragTarget.x += dx;
    this.dragTarget.y += dy;
    this.draw();

    }
    handleMouseUp (event: MouseEvent){
        this.dragTarget = null;
        this.isDown = false;
    }
    handleMouseOut (event: MouseEvent){
        this.handleMouseUp(event);
    }

    hitBox = (x, y) => {
        let isTarget = null;
        for (let i = 0; i < this.boxes.length; i++) {
          const box = this.boxes[i];
          if (
            x >= box.x &&
            x <= box.x + box.w &&
            y >= box.y &&
            y <= box.y + box.h
          ) {
            this.dragTarget = box;
            isTarget = true;
            break;
          }
        }

        // for (let i = 0; i < this.cube.length; i++) {
        //     const box = this.cube[i];
        //     console.log(x,y,box.x,box.y)
        //     if (
        //       x >= box.x &&
        //       x <= box.x &&
        //       y >= box.y &&
        //       y <= box.y 
        //     ) {
        //       this.dragTarget = box;
        //       isTarget = true;
        //       break;
        //     }
        //   }
        return isTarget;
      };

      addEyle(){
          const obj={ x: 100, y: 120, w: 100, h: 50 }
          this.boxes.push(obj)
          this.draw();
      }
    drawLayout(){
        let points = this.outerlayout;
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext("2d");
        for(var i=0;i<points.length;i++){
            ctx.beginPath();
            ctx.moveTo(points[0].x,points[0].y);
            for(var i=1;i<points.length;i++){
              ctx.lineTo(points[i].x,points[i].y);
            }
            ctx.strokeStyle='blue';
            ctx.lineWidth=5;
            ctx.stroke();    
        }
        // for(var i=0;i<points.length;i++){
        //     ctx.beginPath();
        //     ctx.arc(points[i].x,points[i].y,4,0,Math.PI*2);
        //     ctx.closePath();
        //     ctx.strokeStyle='black';
        //     ctx.lineWidth=1;
        //     ctx.stroke();
        //     ctx.fillStyle='white';
        //     ctx.fill();
        //   }
    }

    getEslList() {
        this.spinner.show();
        this.eslService.getAllLowBatteryCount()
            .subscribe(data => {
                this.spinner.hide();
               // if (data['responseCode'] == 200)
                this.eslList = data;
                console.log(this.eslList);
            });
    }

    getCursorPosition = (canvas, event) => {
        const rect = canvas.getBoundingClientRect();
        const xPos = event.clientX - rect.left;
        const yPos = event.clientY - rect.top;
        // console.log(x, y);
        this.outerlayout.push({x:xPos,y:yPos});
        console.log(this.outerlayout);
        //const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(xPos,yPos,4,0,Math.PI*2);
        ctx.closePath();
        ctx.strokeStyle='black';
        ctx.lineWidth=1;
        ctx.stroke();
        ctx.fillStyle='white';
        ctx.fill();
    }

    drawGrid = function(w, h, canvas) {
        var ctx = canvas.getContext('2d');
        ctx.canvas.width  = w;
        ctx.canvas.height = h;
    
    
        for (let x=0;x<=w;x+=20) {
            for (let y=0;y<=h;y+=20) {
                
                ctx.moveTo(x, 0,0.5);
                ctx.lineTo(x, h, 0.5);
                ctx.stroke();
                ctx.moveTo(0, y,0.5);
                ctx.lineTo(w, y, 0.5);
                ctx.strokeStyle = 'rgb(239, 239, 239)';
                ctx.globalCompositeOperation = 'source-over';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    
    }
      

}
