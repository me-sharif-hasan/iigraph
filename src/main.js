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
            if(shape.selected()){
                let elm=null;
                if(document.getElementById(id)==undefined){
                    elm=htmlToElement('<div id="'+id+'" class="property-field"><div class="property-title">'+shape.name+'</div><div class="shape-fill-color" data-hidecolorpicker="false"></div></div>');
                    $(elm.childNodes[1]).on("click",function(e){
                        let bbox=shape.getBBox();
                        toggleColorPicker(true,function(color){
                            elm.childNodes[1].style.background=color;
                            shape.fill(color);
                        },bbox.x+bbox.width+5,bbox.y-3);
                    });

                    document.getElementById("fill").appendChild(elm);
                }else{
                    elm=document.getElementById(id);
                }
                elm.childNodes[1].style.background=shape.getFillColor();
            }else{
                if(document.getElementById(id)!=undefined){
                    document.getElementById(id).remove();
                }
            }
        });

        function htmlToElement(html) {
            var template = document.createElement('template');
            html = html.trim(); // Never return a text node of whitespace as the result
            template.innerHTML = html;
            return template.content.firstChild;
        }