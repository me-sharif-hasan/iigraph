let canvas=document.getElementById("canvas");
        let factory=new Factory(canvas);
        let icns=document.getElementsByClassName("shape-icon");
        Object.keys(icns).forEach(function(e){
            $(icns[e]).on("click",function(x){
                factory.create(x.target.name);
            });
        });
        $(document.getElementById("shape-to-back")).on("click",function(e){
            factory.selectedGoBack();
        });
        $(document.getElementById("shape-to-front")).on("click",function(e){
            factory.selectedComeFront();
        });
        $(factory).on("select",function(shape){
            let id=shape.name;
            let primaryColor=shape.getFillColor();
            if(shape.selected()){
                let elm=null;
                if(document.getElementById(id)==undefined){
                    elm=htmlToElement('<div id="'+id+'" class="property-field"><div class="property-title" align="center">'+shape.name+'</div><input type=text class="shape-fill-color property-value" data-hidecolorpicker="false" data-coloris></input></div>');
                    elm.childNodes[1].value=primaryColor;
                    elm.childNodes[1].style.background=primaryColor;
                    $(elm.childNodes[1]).on("click",function(e){
                        Coloris({  
                            swatches: [
                            '#264653',
                            '#2a9d8f',
                            '#e9c46a',
                            'rgb(244,162,97)',
                            '#e76f51',
                            '#d62828',
                            'navy',
                            '#07b',
                            '#0096c7',
                            '#00b4d880',
                            'rgba(0,119,182,0.8)'
                          ],
                          defaultColor: '#00ff00',
                          format: "rgb"
                        });
                        $(elm.childNodes[1]).on("input",function(e){
                            shape.fill(e.target.value);
                            elm.childNodes[1].style.background=e.target.value;
                        });
                    });

                    document.getElementById("fill").appendChild(elm);
                }else{
                    elm=document.getElementById(id);
                }
            }else{
                if(document.getElementById(id)!=undefined){
                    document.getElementById(id).remove();
                }
            }
        });

        $(factory).on("select",function(shape){
            let id=shape.name;
            let elm;
            let moveUpdate=function(e){
                let x=shape.getBBox().x;
                let y=shape.getBBox().y;
                elm.childNodes[1].value=x;
                elm.childNodes[2].value=y;
            }
            if(shape.selected()){
                let x=shape.getBBox().x;
                let y=shape.getBBox().y;
                elm=htmlToElement('<div id="'+id+'" class="property-field"><div class="property-title" align="center">'+shape.name+'</div><input type="number" class="shape-move property-value" value='+x+'></input><input type="number" class="shape-move property-value" value='+y+'></input></div>');
                document.getElementById("move").appendChild(elm);
                $(shape).on("move",moveUpdate);
                $(shape).on("scale",moveUpdate);
            }else{
                if(document.getElementById(id)!=undefined){
                    document.getElementById(id).remove();
                    shape.removeEventListener("move",moveUpdate);
                    shape.removeEventListener("scale",moveUpdate);
                }
            }
        });

        function htmlToElement(html) {
            var template = document.createElement('template');
            html = html.trim(); // Never return a text node of whitespace as the result
            template.innerHTML = html;
            return template.content.firstChild;
        }