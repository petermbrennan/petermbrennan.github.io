CKEDITOR.dialog.add("uicolor",function(e){function t(e){/^#/.test(e)&&(e=window.YAHOO.util.Color.hex2rgb(e.substr(1))),n.setValue(e,!0),n.refresh(d)}function i(t){e.setUiColor(t),o._.contents.tab1.configBox.setValue('config.uiColor = "#'+n.get("hex")+'"')}var o,n,l=e.getUiColor(),d="cke_uicolor_picker"+CKEDITOR.tools.getNextNumber();return{title:e.lang.uicolor.title,minWidth:360,minHeight:320,onLoad:function(){o=this,this.setupContent(),CKEDITOR.env.ie7Compat&&o.parts.contents.setStyle("overflow","hidden")},contents:[{id:"tab1",label:"",title:"",expand:!0,padding:0,elements:[{id:"yuiColorPicker",type:"html",html:"<div id='"+d+"' class='cke_uicolor_picker' style='width: 360px; height: 200px; position: relative;'></div>",onLoad:function(){var e=CKEDITOR.getUrl("plugins/uicolor/yui/");this.picker=n=new window.YAHOO.widget.ColorPicker(d,{showhsvcontrols:!0,showhexcontrols:!0,images:{PICKER_THUMB:e+"assets/picker_thumb.png",HUE_THUMB:e+"assets/hue_thumb.png"}}),l&&t(l),n.on("rgbChange",function(){o._.contents.tab1.predefined.setValue(""),i("#"+n.get("hex"))});for(var e=new CKEDITOR.dom.nodeList(n.getElementsByTagName("input")),r=0;r<e.count();r++)e.getItem(r).addClass("cke_dialog_ui_input_text")}},{id:"tab1",type:"vbox",children:[{type:"hbox",children:[{id:"predefined",type:"select","default":"",label:e.lang.uicolor.predefined,items:[[""],["Light blue","#9AB8F3"],["Sand","#D2B48C"],["Metallic","#949AAA"],["Purple","#C2A3C7"],["Olive","#A2C980"],["Happy green","#9BD446"],["Jezebel Blue","#14B8C4"],["Burn","#FF893A"],["Easy red","#FF6969"],["Pisces 3","#48B4F2"],["Aquarius 5","#487ED4"],["Absinthe","#A8CF76"],["Scrambled Egg","#C7A622"],["Hello monday","#8E8D80"],["Lovely sunshine","#F1E8B1"],["Recycled air","#B3C593"],["Down","#BCBCA4"],["Mark Twain","#CFE91D"],["Specks of dust","#D1B596"],["Lollipop","#F6CE23"]],onChange:function(){var e=this.getValue();e?(t(e),i(e),CKEDITOR.document.getById("predefinedPreview").setStyle("background",e)):CKEDITOR.document.getById("predefinedPreview").setStyle("background","")},onShow:function(){var t=e.getUiColor();t&&this.setValue(t)}},{id:"predefinedPreview",type:"html",html:'<div id="cke_uicolor_preview" style="border: 1px solid black; padding: 3px; width: 30px;"><div id="predefinedPreview" style="width: 30px; height: 30px;">&nbsp;</div></div>'}]},{id:"configBox",type:"text",label:e.lang.uicolor.config,onShow:function(){var t=e.getUiColor();t&&this.setValue('config.uiColor = "'+t+'"')}}]}]}],buttons:[CKEDITOR.dialog.okButton]}});