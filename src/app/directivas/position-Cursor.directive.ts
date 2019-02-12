import {Directive, ElementRef, Renderer, HostListener, Output, EventEmitter} from '@angular/core';
@Directive({
    selector: '[positionCursor]'
  })

  export class PositionCursorDirective {

    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

    constructor(private el: ElementRef,
      private render: Renderer) { }
  
    @HostListener('keyup', ['$event']) onInputChange(event) {
      // get position
     
      let pos = this.el.nativeElement.selectionStart;
  
      let val = this.el.nativeElement.value;
      debugger;
      // remove dup
      // if key is '.' and next character is '.', skip position
      if (event.key === '.' &&
        val.charAt(pos) === '.') {
         
        val = val.replace('.', '');
  
        this.render.setElementProperty(this.el.nativeElement, 'value', val);
        this.ngModelChange.emit(val);
        this.el.nativeElement.selectionStart = pos;
        this.el.nativeElement.selectionEnd = pos;
      
       
      }
    }

  }