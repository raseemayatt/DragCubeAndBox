import { Component, ElementRef, Input, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../alert/alert.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EslService } from '@app/_services/esl.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '@environments/environment';
import { ConfirmationDialogService } from '@app/_components/confirm-popup/popup.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DownloadService } from '@app/_services/downloads.service';
import { saveAs } from 'file-saver';



@Component({ templateUrl: 'designer_details.html' })

export class DesignerDetailsComponent implements OnInit {
  loading = false;
  priceLabelList: any;
  priceLabelListData: any;
  priceTemplateList: any;
  priceTemplateListData: any;
  labelImageData: any;
  templateData: any;
  priceTemplateImageData: any;
  previewVisible;
  templateListVisible;
  templateEditFormVisible;
  tabsAvailability: any = environment.config.tabs.designer.tabs;
  themeBg: any = environment.config.theme.background;
  fieldNameVisible: any = false;
  fieldList;
  closeModal: string;
  paperTypeList: any;
  paperTypeListReverse: any;
  paperTypeVisible: any;
  templateTypeVisible: any;
  XpositionVisible: any;
  YpositionVisible: any;
  templateWidthVisible: any;
  templateHeightVisible: any;
  updateFieldVisible: any;




  tempName;
  tempType;
  papType;
  imageWidth;
  imageHeight;
  imageBackgrnd;
  imageForeground;
  imageBorder;
  imageBorderSize;
  imageColourLabel;
  templateId;
  templateDetailData;
  templateComponents;
  fieldTypeVal;
  fieldXpositionVal;
  fieldYpositionVal;
  fieldIdVal;
  labelImageDataId;
  fieldsizeVal;
  fieldpositionVal;
  fieldstrikeVal;
  fieldcolorVal;
  productNameVal;
  fieldNameVal;
  paperTypeVal;
  widthVal;
  heightVal;



  previewLoading: any = false;
  imageData: any = null;
  previewImageUrl: string = environment.config.previewTagImgUrl;
  data = [
    { name: 'Purple', color: '#800080' },
    { name: 'White', color: '#FFFFFF' },
    { name: 'Navy', color: '#000080' },
    { name: 'Teal', color: '#008080' },
    { name: 'Green', color: '#008000' },
    { name: 'Maroon', color: '#800000' },
    { name: 'Black', color: '#000000' },
    { name: 'Sea Blue', color: '#6495ED' },
    { name: 'Dark Pink', color: '#DE3163' },
    { name: 'Orange', color: '#FF7F50' },
    { name: 'Glowing Green', color: '#DFFF00' }
  ];

  @ViewChild('backg') backG: ElementRef;
  @ViewChild('foreg') foreG: ElementRef;
  @ViewChild('borderbg') borderBG: ElementRef;
  @ViewChild('bordersize') borderSize: ElementRef;
  @ViewChild('coloured') coloured: ElementRef;
  @ViewChild('labellist') labelList: ElementRef;
  @ViewChildren('inputs') inputsList: QueryList<ElementRef>;
  @ViewChild('imgWidth') imgWidth: ElementRef;
  @ViewChild('imgHeight') imgHeight: ElementRef;
  @ViewChild('templateName') templateName: ElementRef;
  @ViewChild('templateType') templateType: ElementRef;
  @ViewChild('paperType') paperType: ElementRef;
  @ViewChild('fieldType') fieldType: ElementRef;
  @ViewChild('productName') productName: ElementRef;
  @ViewChild('fieldName') fieldName: ElementRef;
  @ViewChild('fieldSize') fieldSize: ElementRef;
  @ViewChild('fieldPosition') fieldPosition: ElementRef;
  @ViewChild('fieldStrike') fieldStrike: ElementRef;
  @ViewChild('fieldColor') fieldColor: ElementRef;
  @ViewChild('fixX') fixX: ElementRef;
  @ViewChild('fixY') fixY: ElementRef;

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private eslService: EslService,
    private sanitizer: DomSanitizer,
    private confirmationDialogService: ConfirmationDialogService,
    private _Activatedroute: ActivatedRoute,
    private _router: Router,
    private downloadService: DownloadService
  ) {
  }

  sub;



  ngOnInit() {
    this.sub = this._Activatedroute.paramMap.subscribe(params => {
      this.templateId = params.get('id');
      this.eslService.getPriceLabelTempatesbyName(this.templateId)
        .subscribe(data => {
          this.templateDetailData = data;
          this.editTemplate(this.templateDetailData);
        }
        );
      console.log("template id = " + this.templateId);
    });
    this.getLabelFields();
    this.loadScript("assets/tabs.js");
    this.getLabelTempates();
    this.listFields();
    this.getPaperType();
    this.previewVisible = false;
    this.templateListVisible = true;
    this.templateEditFormVisible = false;
    this.updateFieldVisible = false;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    localStorage.setItem("designerFieldList", JSON.stringify([]));
  }

  listMaker(start: number, end: number) {
    var foo = [];
    for (var i = start; i <= end; i++) {
      foo.push(i);
    }
    return foo;
  }

  listFields() {
    if (localStorage.getItem("designerFieldList") === null) {
      this.fieldList = [];
    } else {
      this.fieldList = JSON.parse(localStorage.getItem("designerFieldList"));
    }
  }

  validateFieldValue() {


    let fieldValueValidation = "";
    let fieldValueValidationItems = [];
    // console.log("Valid" + this.productName.nativeElement.value);
    console.log("Valid" + this.fieldType.nativeElement.value);
    
    if (this.fieldType.nativeElement.value == "") {
      fieldValueValidationItems.push("Field Type");
    }
    else{
      if(this.fieldType.nativeElement.value == 2)
      {
        if (this.productName.nativeElement.value == "") {
          fieldValueValidationItems.push("Product Name");
        }      
      }
      else{
        if (this.fieldName.nativeElement.value == "") {
          fieldValueValidationItems.push("Field Name");
        }
      }
    }
    if (this.fieldPosition.nativeElement.value == "") {
      fieldValueValidationItems.push("Position");
    }
    if (this.fieldStrike.nativeElement.value == "") {
      fieldValueValidationItems.push("Strike");
    }
    if (fieldValueValidationItems.length > 0) {
      fieldValueValidation = "Please enter " + fieldValueValidationItems.join(", ");
    }
    console.log(fieldValueValidation);
    if (fieldValueValidation != "") {

      this.alertService.error(fieldValueValidation,
        { autoClose: true }
      );
      this.loading = false;

      return false;
    }
    else {
      return true;
    }
  }






  addField(fieldIdValue) {
    let validateFields = this.validateFieldValue();
    if (validateFields) {
      this.updateFieldVisible = false;
      var fieldObj = {};

      if (this.fieldType.nativeElement.value == 2) {
        fieldObj['productName'] = this.productName.nativeElement.value;
        fieldObj['fieldName'] = "";
        fieldObj['fieldType'] = true;

      } else {
        fieldObj['fieldName'] = this.fieldName.nativeElement.value;
        fieldObj['productName'] = "";
        fieldObj['fieldType'] = false;
      }
      fieldObj['fieldSize'] = this.fieldSize.nativeElement.value;
      fieldObj['fieldPosition'] = this.fieldPosition.nativeElement.value;
      fieldObj['fieldStrike'] = this.fieldStrike.nativeElement.value;
      fieldObj['fieldColor'] = this.fieldColor.nativeElement.value;
      if (this.fieldPosition.nativeElement.value == "00") {
        fieldObj['fixX'] = this.fixX.nativeElement.value;
        fieldObj['fixY'] = this.fixY.nativeElement.value;
      }

      else if (this.fieldPosition.nativeElement.value == "03") {
        fieldObj['fixX'] = null;
        fieldObj['fixY'] = this.fixY.nativeElement.value;
      }
      else if (this.fieldPosition.nativeElement.value == "02") {
        fieldObj['fixX'] = null;
        fieldObj['fixY'] = this.fixY.nativeElement.value;
      }
      else if (this.fieldPosition.nativeElement.value == "01") {
        fieldObj['fixX'] = null;
        fieldObj['fixY'] = this.fixY.nativeElement.value;
      }
      else if (this.fieldPosition.nativeElement.value == "30") {
        fieldObj['fixX'] = this.fixX.nativeElement.value;
        fieldObj['fixY'] = null;
      }
      else if (this.fieldPosition.nativeElement.value == "20") {
        fieldObj['fixX'] = this.fixX.nativeElement.value;
        fieldObj['fixY'] = null;
      }
      else if (this.fieldPosition.nativeElement.value == "10") {
        fieldObj['fixX'] = this.fixX.nativeElement.value;
        fieldObj['fixY'] = null;
      }
      else {
        fieldObj['fixX'] = null;
        fieldObj['fixY'] = null;
      }

      if (fieldIdValue) {
        fieldObj["_id"] = fieldIdValue;
        let fullList = this.fieldList;
        let newFullList = [];
        for (let i = 0; i < fullList.length; i++) {
          if (fullList[i]["_id"] != fieldIdValue) {
            newFullList.push(fullList[i]);
          }
        }
        this.fieldIdVal = null;
        this.fieldList = newFullList;

      }
      else {
        fieldObj["_id"] = new Date().getTime();
      }


      this.fieldList.push(fieldObj);
      localStorage.setItem("designerFieldList", JSON.stringify(this.fieldList));
    }
  }

  public loadScript(url) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  changeFieldType() {
    console.log(this.fieldType.nativeElement.value);
    if (this.fieldType.nativeElement.value == 0) {
      this.fieldNameVisible = true;
    } else {
      this.fieldNameVisible = false;
    }
  }

  deleteField(fieldId) {
    let fullList = this.fieldList;
    var newList = [];
    for (let i = 0; i < fullList.length; i++) {
      if (fullList[i]["_id"] != fieldId) {
        newList.push(fullList[i]);
      }
    }
    this.fieldList = newList;
    localStorage.setItem("designerFieldList", JSON.stringify(this.fieldList));
  }

  editField(fieldId) {
    this.updateFieldVisible = true;
    let fullList = this.fieldList;
    var newList = [];
    for (let i = 0; i < fullList.length; i++) {
      if (fullList[i]["_id"] == fieldId) {
        // newList.push(fullList[i]);
        this.fieldIdVal = fieldId;
        console.log(fullList[i]["fixX"]);
        // this.fieldTypeVal = 0;
        if (fullList[i]["fieldType"]) {
          this.fieldTypeVal = 2;
          this.productNameVal = fullList[i]["productName"];
          this.fieldNameVisible = false;
        }
        else {
          this.fieldTypeVal = 0;
          this.fieldNameVal = fullList[i]["fieldName"];
          this.fieldNameVisible = true;
          console.log(fullList[i]["fieldName"]);
        }

        this.fieldsizeVal = fullList[i]["fieldSize"];
        this.fieldpositionVal = fullList[i]["fieldPosition"];
        this.fieldstrikeVal = fullList[i]["fieldStrike"];
        this.fieldcolorVal = fullList[i]["fieldColor"];

        if (this.fieldpositionVal == "00") {
          this.fieldXpositionVal = fullList[i]["fixX"];
          this.fieldYpositionVal = fullList[i]["fixY"];
          this.XpositionVisible = true;
          this.YpositionVisible = true;
        }

        else if (this.fieldpositionVal == "03") {
          this.fieldXpositionVal = null;
          this.fieldYpositionVal = fullList[i]["fixY"];
          this.XpositionVisible = false;
          this.YpositionVisible = true;
        }
        else if (this.fieldpositionVal == "02") {
          this.fieldXpositionVal = null;
          this.fieldYpositionVal = fullList[i]["fixY"];
          this.XpositionVisible = false;
          this.YpositionVisible = true;
        }
        else if (this.fieldpositionVal == "01") {
          this.fieldXpositionVal = null;
          this.fieldYpositionVal = fullList[i]["fixY"];
          this.XpositionVisible = false;
          this.YpositionVisible = true;
        }
        else if (this.fieldpositionVal == "30") {
          this.fieldXpositionVal = fullList[i]["fixX"];
          this.fieldYpositionVal = null;
          this.XpositionVisible = true;
          this.YpositionVisible = false;

        }
        else if (this.fieldpositionVal == "20") {
          this.fieldXpositionVal = fullList[i]["fixX"];
          this.fieldYpositionVal = null;
          this.XpositionVisible = true;
          this.YpositionVisible = false;
        }
        else if (this.fieldpositionVal == "10") {
          this.fieldXpositionVal = fullList[i]["fixX"];
          this.fieldYpositionVal = null;
          this.XpositionVisible = true;
          this.YpositionVisible = false;
        }
        else {
          this.fieldXpositionVal = null;
          this.fieldYpositionVal = null;
          this.XpositionVisible = false;
          this.YpositionVisible = false;
        }
      }
    }
    // this.fieldList = newList;
    // localStorage.setItem("designerFieldList", JSON.stringify(this.fieldList));
  }

  getLabelFields() {

    this.spinner.show();
    this.eslService.getAllPriceLabelFields()
      .subscribe(data => {
        this.spinner.hide();
        if (data['responseCode'] == 200) {
          this.priceLabelList = data['objList'];
          this.priceLabelListData = JSON.stringify(this.priceLabelList);
        }

      });
  }

  getLabelTempates() {

    this.templateListVisible = true;
    this.templateEditFormVisible = false;
    this.eslService.getAllPriceLabelTempates()
      .subscribe(data => {
        if (data['responseCode'] == 200) {
          this.priceTemplateList = data['objList'];
          this.priceTemplateListData = JSON.stringify(this.priceTemplateList);
        }

      });

  }

  getPaperType() {

    let newPaperList = [];
    this.eslService.getAllPriceLabelTypes()
      .subscribe(data => {
        this.paperTypeList = data;
        for (let i = this.paperTypeList.length - 1; i >= 0; i--) {
          newPaperList.push(this.paperTypeList[i]);
        }
      });
    this.paperTypeListReverse = newPaperList;
  }

  changePosition() {
    console.log(this.fieldPosition.nativeElement.value);
    if (this.fieldPosition.nativeElement.value == "00") {
      this.XpositionVisible = true;
      this.YpositionVisible = true;
    }
    else if (this.fieldPosition.nativeElement.value == "03") {
      this.XpositionVisible = false;
      this.YpositionVisible = true;
    }
    else if (this.fieldPosition.nativeElement.value == "02") {
      this.XpositionVisible = false;
      this.YpositionVisible = true;
    }
    else if (this.fieldPosition.nativeElement.value == "01") {
      this.XpositionVisible = false;
      this.YpositionVisible = true;
    }
    else if (this.fieldPosition.nativeElement.value == "30") {
      this.XpositionVisible = true;
      this.YpositionVisible = false;
    }
    else if (this.fieldPosition.nativeElement.value == "20") {
      this.XpositionVisible = true;
      this.YpositionVisible = false;
    }
    else if (this.fieldPosition.nativeElement.value == "10") {
      this.XpositionVisible = true;
      this.YpositionVisible = false;
    }
    else {
      this.XpositionVisible = false;
      this.YpositionVisible = false;
    }
  }

  changePaperType() {
    if (this.paperType.nativeElement.value == "Custom") {
      this.templateTypeVisible = true;
      this.templateWidthVisible = true;
      this.templateHeightVisible = true;
      // this.imageWidth = "240";
      // this.imageHeight = "146";
    }

    else if (this.paperType.nativeElement.value == "Letter") {
      this.templateTypeVisible = false;
      this.templateWidthVisible = false;
      this.templateHeightVisible = false;
      this.imageWidth = "3300";
      this.imageHeight = "2550";
    }
    else if (this.paperType.nativeElement.value == "A4") {
      this.paperType.nativeElement.value == 3;
      this.templateTypeVisible = false;
      this.templateWidthVisible = false;
      this.templateHeightVisible = false;
      this.imageWidth = "3510";
      this.imageHeight = "2490";
    }
    else if (this.paperType.nativeElement.value == "Legal") {
      this.templateTypeVisible = false;
      this.templateWidthVisible = false;
      this.templateHeightVisible = false;
      this.imageWidth = "4200";
      this.imageHeight = "2550";
    }
  }


  activateLabelTempates(id) {

    this.eslService.setActiveLabelTemplateById(id)
      .subscribe(data => {
        if (data['responseCode'] == 200) {
          this.alertService.success("Template successfully activated!",
            { autoClose: true }
          );
          this.getLabelTempates();
        }
      });
  }

  deleteTemplate(id) {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to delete this template?')
      .then((confirmed) => {
        console.log('User confirmed:', confirmed);
        if (confirmed) {

          // this.loading = true;
          this.alertService.clear();
          this.eslService.removeLabelTempates(id)
            .subscribe(data => {
              if (data['responseCode'] == 200) {
                this.getLabelTempates();
                this.alertService.success("Template Deleted Successfully",
                  { autoClose: true }
                );
                // this.loading = false;
              }
              else {
                this.alertService.error("You cannot delete an active template",
                  { autoClose: true }
                );

              }

            });
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

  }

  getLabelTempatesbyId(Id) {
    this.previewLoading = true;
    this.eslService.getPriceLabelTempatesbyId(Id)
      .subscribe(data => {
        if (data['responseCode'] == 200) {
          this.previewVisible = true;
          this.labelImageData = data['priceLabelTemplateVO'];
          console.log(this.labelImageData);
          this.priceTemplateImageData = this.labelImageData.templateJson;
          let oldstr = this.priceTemplateImageData;
          var newstr = oldstr.replace(/\\/g, "");
          var labelstr = JSON.parse(newstr);
          var productInfo = this.getProductSpecificInfo();
          this.eslService.eslDesignPreview(productInfo, labelstr)
            .subscribe(data => {
              console.log(data);
              this.previewLoading = false;
              let objectURL = URL.createObjectURL(data);
              this.imageData = this.sanitizer.bypassSecurityTrustUrl(objectURL);
              // this.imageData = data;
            });
        }
      });
  }

  editTemplate(data) {


    this.fieldIdVal = null;
    this.labelImageData = data['priceLabelTemplateVO'];
    this.labelImageDataId = this.labelImageData.id;
    this.priceTemplateImageData = this.labelImageData.templateJson;
    this.templateName = this.labelImageData.templateName;


    console.log(this.templateName);
    var newst = this.priceTemplateImageData.replace(/\\/g, "");

    var str = JSON.parse(newst);
    this.initialPreview(str);
    console.log(str.components);
    //         "productName": "upc",
    // "fieldName": "",
    // "fieldType": true,
    // "fieldSize": "8",
    // "fieldPosition": "11",
    // "fieldStrike": "0",
    // "fieldColor": "#800080",
    // "fixX": "1",
    // "fixY": "1",
    // "_id": 1645696050991

    var fieldListDraft = {};
    let fieldInfo = {};
    let fieldPositionDraft = "";
    this.fieldList = [];
    for (let k = 0; k < str.components.length; k++) {
      fieldPositionDraft = "";
      fieldListDraft = { "productName": "", "fieldName": "", "fieldType": true, "fieldSize": "", "fieldPosition": "", "fieldStrike": "0", "fieldColor": "", "fixX": "", "fixY": "", "_id": "" };
      if ((str.components[k].fields.length > 0)) {
        fieldInfo = str.components[k].fields[0];
        if (fieldInfo['type'] == 2) {
          fieldListDraft["productName"] = fieldInfo["fieldValue"];
          fieldListDraft["fieldName"] = "";
          fieldListDraft["fieldType"] = true;
          fieldListDraft["isImage"] = false;
        } else if (fieldInfo['type'] == 3) {
          fieldListDraft["fieldName"] = "";
          fieldListDraft["productName"] = fieldInfo["fieldValue"];
          fieldListDraft["fieldType"] = true;
          fieldListDraft["isImage"] = true;
        } else {
          if (fieldInfo["fieldValue"].trim() == 'Qty') {
            fieldListDraft["productName"] = "qty";
            fieldListDraft["fieldName"] = "";
            fieldListDraft["fieldType"] = true;
            fieldListDraft["isImage"] = false;
          } else {
            fieldListDraft["productName"] = "";
            fieldListDraft["fieldName"] = fieldInfo["fieldValue"];
            fieldListDraft["fieldType"] = false;
            fieldListDraft["isImage"] = false;
          }

        }
      }
      //"fieldSize": "8",
      // "fieldPosition": "11",
      // "fieldStrike": "0",
      // "fieldColor": "#800080",
      // "fixX": "1",
      // "fixY": "1",
      fieldPositionDraft = fieldPositionDraft + str.components[k].verAlign + str.components[k].horAlign;
      fieldListDraft["fieldSize"] = str.components[k].fontSize.toString();
      fieldListDraft["fieldPosition"] = fieldPositionDraft;
      if (typeof str.components[k].strikeOut != "undefined") {
        fieldListDraft["fieldStrike"] = str.components[k].strikeOut.type.toString();
      }
      if (typeof str.components[k].txtColor != "undefined") {
        fieldListDraft["fieldColor"] = this.rgbToHex(str.components[k].txtColor.r, str.components[k].txtColor.g, str.components[k].txtColor.b);
      }
      if (typeof str.components[k].fontStyle != "undefined") {
        fieldListDraft["fontStyle"] = str.components[k].fontStyle.toString();
      }
      if (str.components[k].x != null) {
        fieldListDraft["fixX"] = str.components[k].x.toString();
      }
      if (str.components[k].y != null) {
        fieldListDraft["fixY"] = str.components[k].y.toString();
      }
      fieldListDraft["_id"] = (new Date().getTime()) + Math.floor(Math.random() * 10000);
      this.fieldList.push(fieldListDraft);
    }
    localStorage.setItem("designerFieldList", JSON.stringify(this.fieldList));


    this.tempName = this.labelImageData.templateName;
    this.tempType = this.labelImageData.type;
    this.paperTypeVal = this.labelImageData.paperType;
    // this.paperTypeVal = this.labelImageData.paperType; 
    console.log("paper typre is" + this.paperTypeVal);
    if (this.paperTypeVal == "Custom") {
      this.templateTypeVisible = true;
      this.templateWidthVisible = true;
      this.templateHeightVisible = true;
      this.imageWidth = parseInt(str.width);
      this.imageHeight = parseInt(str.height);
    }
    else if (this.paperTypeVal == "Letter") {
      this.templateTypeVisible = false;
      this.templateWidthVisible = false;
      this.templateHeightVisible = false;
      this.imageWidth = parseInt(str.width);
      this.imageHeight = parseInt(str.height);

    }
    else if (this.paperTypeVal == "A4") {
      this.templateTypeVisible = false;
      this.templateWidthVisible = false;
      this.templateHeightVisible = false;
      this.imageWidth = parseInt(str.width);
      this.imageHeight = parseInt(str.height);

    }
    else if (this.paperTypeVal == "Legal") {
      this.templateTypeVisible = false;
      this.templateWidthVisible = false;
      this.templateHeightVisible = false;
      this.imageWidth = parseInt(str.width);
      this.imageHeight = parseInt(str.height);

    }

    // this.imageWidth = parseInt(str.width);
    // this.imageHeight = parseInt(str.height);
    this.imageBorderSize = parseInt(str.border);
    var labclr = JSON.stringify(str.coloredLabel);

    this.imageBackgrnd = this.rgbToHex(parseInt(str.bgColor.r), parseInt(str.bgColor.g), parseInt(str.bgColor.b));
    this.imageForeground = this.rgbToHex(parseInt(str.fgColor.r), parseInt(str.fgColor.g), parseInt(str.fgColor.b));
    this.imageBorder = this.rgbToHex(parseInt(str.borderColor.r), parseInt(str.borderColor.g), parseInt(str.borderColor.b));

    if (labclr == 'true') {
      this.imageColourLabel = "1";
    }
    else {
      this.imageColourLabel = "0";
    }
    this.templateComponents = str.components;
    let singleComponent = {};
    let componentList = [];
    let fields;
    for (let i = 0; i < this.templateComponents; i++) {
      singleComponent = {
        "productName": "",
        "fieldName": "",
        "fieldType": true,
        "fieldSize": "",
        "fieldPosition": "",
        "fieldStrike": "",
        "fieldColor": "",
        "fixX": "",
        "fixY": "",
        "_id": new Date().getTime()
      };
      singleComponent['fixX'] = this.templateComponents[i]["x"];
      singleComponent['fixY'] = this.templateComponents[i]["y"];
      singleComponent['fieldColor'] = this.rgbToHex(this.templateComponents[i]["txtColor"]["r"], this.templateComponents[i]["txtColor"]["g"], this.templateComponents[i]["txtColor"]["b"]);
      // TO DO remaning later

    }
    // fieldColor: "#800080"
    // fieldName: ""
    // fieldPosition: "11"
    // fieldSize: "8"
    // fieldStrike: "0"
    // fieldType: true
    // fixX: "1"
    // fixY: "1"
    // productName: "upc"
    // _id: 1645696050991
  }




  getSelectedProductFields() {
    let pdtList = JSON.parse(this.labelList.nativeElement.value);
    let eleList = [];
    let inputList = this.inputsList['_results'];
    //console.log(this.inputsList['_results']);
    // this.inputsList.forEach(function(item, indx){
    for (let j = 0; j < inputList.length; j++) {

      for (let i = 0; i < pdtList.length; i++) {
        if ((inputList[j].nativeElement.name == pdtList[i] + "_check") && (inputList[j].nativeElement.checked === true)) {
          eleList.push(pdtList[i]);
        }
      }
    }
    // console.log(eleList);       
    // });
    return eleList;
  }

  createRawProductComponent() {
    // default object for every component. This will be updated based on user input.
    return {
      "verAlign": 1,
      "horAlign": 3,
      "x": 0,
      "y": 0,
      "fontStyle": 1,
      "fontSize": 16,
      "width": 0,
      "height": 0,
      "txtColor": {
        "r": 0,
        "g": 0,
        "b": 255
      },
      "fields": [],
      "allowSubDecimal": false
    };
  }

  getProductSpecificInfo() {
    // This data is for preview purpose.
    return {
      "itemName": "KIRKLAND SIGNATURE",
      "price": "6.29",
      // "discountPrice": "9999.90",
      "quantityValue": "2/1",
      "quantityUnit": "GAL",
      "eslId": "1634533816967",
      "count": "1",
      "itemDescription": "2% LOWFAT MILK",
      "unitPrice": "3.145"
    };
  }

  getStrikeThroughObj(strokeType) {
    let strType = parseInt(strokeType);
    return {
      "type": strType,
      "strokeWidth": 3,
      "strokeColor": {
        "r": 0,
        "g": 0,
        "b": 0
      }
    };
  }

  createLabelInfo() {
    let componentObj = {};
    let componentList = [];
    let componentField = {};
    var alignPositions, alignPositionDigits, alignPositionRealDigits;
    let fullList = this.fieldList;
    for (let i = 0; i < fullList.length; i++) {
      componentObj = this.createRawProductComponent();
      componentObj['fontSize'] = parseInt(fullList[i]["fieldSize"]);
      alignPositions = fullList[i]["fieldPosition"];
      alignPositionDigits = alignPositions.split('');
      alignPositionRealDigits = alignPositionDigits.map(Number);
      componentObj['verAlign'] = alignPositionRealDigits[0];
      componentObj['horAlign'] = alignPositionRealDigits[1];
      componentObj['x'] = parseInt(fullList[i]["fixX"]);
      componentObj['y'] = parseInt(fullList[i]["fixY"]);
      if (typeof fullList[i]["fontStyle"] != "undefined") {
        componentObj['fontStyle'] = parseInt(fullList[i]["fontStyle"]);
      }
      if (fullList[i]["fieldStrike"] != "0") {
        componentObj['strikeOut'] = this.getStrikeThroughObj(fullList[i]["fieldStrike"]);
      }
      componentObj['txtColor'] = this.hexToRgb(fullList[i]["fieldColor"]);

      if (fullList[i]["fieldType"] === true) {
        //product value
        componentField = {};
        if (fullList[i]["productName"] == 'qty' || fullList[i]["productName"] == 'quantityValue' || fullList[i]["productName"] == 'quantityUnit') {
          componentObj['fields'] = [
            { "type": 1, "fieldValue": "Qty " },
            { "type": 2, "fieldValue": "quantityValue" },
            { "type": 2, "fieldValue": "quantityUnit" }
          ];
        } else {
          let isImage = false;
          if (typeof fullList[i]["isImage"] != "undefined") {
            if (fullList[i]["isImage"] == true) {
              isImage = true;
            }
          }
          if (isImage) {
            componentField['type'] = 3;
            componentField['fieldValue'] = fullList[i]["productName"];
            componentObj['height'] = 20;
            componentObj['width'] = 20;
          } else {
            componentField['type'] = 2;
            componentField['fieldValue'] = fullList[i]["productName"];
          }

          componentObj['fields'].push(componentField);
        }
      } else {
        //label
        componentField = {};
        componentField['type'] = 1;
        componentField['fieldValue'] = fullList[i]["fieldName"];
        componentObj['fields'].push(componentField);
      }
      componentList.push(componentObj);
    }
    let colouredLabel = false;
    if (this.coloured.nativeElement.value == "1") {
      colouredLabel = true;
    }

    this.previewLoading = true;
    this.imageData = null;

    var labelInfo = {
      "width": this.imgWidth.nativeElement.value,
      "height": this.imgHeight.nativeElement.value,
      "border": this.borderSize.nativeElement.value,
      "bgColor": this.hexToRgb(this.backG.nativeElement.value),
      "borderColor": this.hexToRgb(this.borderBG.nativeElement.value),
      "fgColor": this.hexToRgb(this.foreG.nativeElement.value),
      "coloredLabel": colouredLabel,
      "components": componentList
      //[{"verAlign":1,"horAlign":1,"x":0,"y":0,"fontStyle":1,"fontSize":16,"width":0,"height":0,"txtColor":{"r":255,"g":0,"b":0},"fields":[{"type":1,"fieldValue":"MRP"}],"allowSubDecimal":false},{"verAlign":1,"horAlign":3,"x":0,"y":0,"fontStyle":1,"fontSize":16,"width":0,"height":0,"txtColor":{"r":0,"g":0,"b":255},"fields":[{"type":1,"fieldValue":"Our Price"}],"allowSubDecimal":false},{"verAlign":0,"horAlign":1,"x":0,"y":55,"fontStyle":2,"fontSize":30,"width":0,"height":0,"txtColor":{"r":255,"g":0,"b":0},"fields":[{"type":2,"fieldValue":"price"}],"allowSubDecimal":true,"strikeOut":{"type":3,"strokeWidth":3,"strokeColor":{"r":0,"g":0,"b":0}}},{"verAlign":0,"horAlign":0,"x":112,"y":35,"fontStyle":0,"fontSize":0,"width":20,"height":20,"fields":[{"type":3,"fieldValue":"rupee_gr_white.png"}],"allowSubDecimal":false},{"verAlign":0,"horAlign":3,"x":0,"y":55,"fontStyle":2,"fontSize":30,"width":0,"height":0,"fields":[{"type":2,"fieldValue":"discountPrice"}],"allowSubDecimal":true},{"verAlign":0,"horAlign":2,"x":0,"y":90,"fontStyle":2,"fontSize":16,"width":0,"height":0,"fields":[{"type":1,"fieldValue":"Qty "},{"type":2,"fieldValue":"quantityValue"},{"type":2,"fieldValue":"quantityUnit"}],"allowSubDecimal":false},{"verAlign":3,"horAlign":2,"x":0,"y":0,"fontStyle":1,"fontSize":16,"width":0,"height":0,"txtColor":{"r":255,"g":255,"b":0},"fields":[{"type":2,"fieldValue":"itemName"}],"allowSubDecimal":false}]
    };
    console.log(JSON.stringify(labelInfo));
    return labelInfo;
  }

  createLabelInfoOld() {
    let pdtList = JSON.parse(this.labelList.nativeElement.value);
    //  console.log(this.borderBG.nativeElement.value);
    let eleList = this.getSelectedProductFields();
    let componentObj = {};
    let componentList = [];
    let componentField = {};
    var alignPositions, alignPositionDigits, alignPositionRealDigits;
    let inputList = this.inputsList['_results'];
    for (let i = 0; i < eleList.length; i++) {
      // console.log(eleList[i]);
      componentObj = this.createRawProductComponent();
      // console.log(this.inputsList);
      for (let j = 0; j < inputList.length; j++) {
        // console.log(this.inputsList[j].nativeElement.name);
        if (eleList[i] + "_size" == inputList[j].nativeElement.name) {
          componentObj['fontSize'] = parseInt(inputList[j].nativeElement.value);
        }
        if (eleList[i] + "_position" == inputList[j].nativeElement.name) {
          alignPositions = inputList[j].nativeElement.value;
          alignPositionDigits = alignPositions.split('');
          alignPositionRealDigits = alignPositionDigits.map(Number);
          componentObj['verAlign'] = alignPositionRealDigits[0];
          componentObj['horAlign'] = alignPositionRealDigits[1];
        }
        if (eleList[i] + "_x" == inputList[j].nativeElement.name) {
          componentObj['x'] = parseInt(inputList[j].nativeElement.value);
        }
        if (eleList[i] + "_y" == inputList[j].nativeElement.name) {
          componentObj['y'] = parseInt(inputList[j].nativeElement.value);
        }
        if (eleList[i] + "_strike" == inputList[j].nativeElement.name) {
          if (inputList[j].nativeElement.value != "0") {
            componentObj['strikeOut'] = this.getStrikeThroughObj(inputList[j].nativeElement.value);
          }
        }
        if (eleList[i] + "_color" == inputList[j].nativeElement.name) {
          componentObj['txtColor'] = this.hexToRgb(inputList[j].nativeElement.value);
        }
      }
      componentField = {};
      if (pdtList.includes(eleList[i])) {
        // product variable field value from db
        if (eleList[i] == 'quantityValue' || eleList[i] == 'quantityUnit') {
          componentObj['fields'] = [
            { "type": 1, "fieldValue": "Qty " },
            { "type": 2, "fieldValue": "quantityValue" },
            { "type": 2, "fieldValue": "quantityUnit" }
          ];
        } else {
          componentField['type'] = 2;
          componentField['fieldValue'] = eleList[i];
          componentObj['fields'].push(componentField);
        }


      }

      componentList.push(componentObj);
    }

    let labelCount = this.priceLabelList.length;
    let labelIndexList = [];
    for (let i = 0; i < labelCount; i++) {
      for (let j = 0; j < inputList.length; j++) {
        if ((inputList[j].nativeElement.name == i + "_check") && (inputList[j].nativeElement.checked === true)) {
          labelIndexList.push(i);
        }
      }
    }
    for (let i = 0; i < labelIndexList.length; i++) {
      componentObj = this.createRawProductComponent();
      for (let j = 0; j < inputList.length; j++) {

        if (labelIndexList[i] + "_size" == inputList[j].nativeElement.name) {
          componentObj['fontSize'] = parseInt(inputList[j].nativeElement.value);
        }
        if (labelIndexList[i] + "_position" == inputList[j].nativeElement.name) {
          alignPositions = inputList[j].nativeElement.value;
          alignPositionDigits = alignPositions.split('');
          alignPositionRealDigits = alignPositionDigits.map(Number);
          componentObj['verAlign'] = alignPositionRealDigits[0];
          componentObj['horAlign'] = alignPositionRealDigits[1];
        }
        if (labelIndexList[i] + "_x" == inputList[j].nativeElement.name) {
          componentObj['x'] = parseInt(inputList[j].nativeElement.value);
        }
        if (labelIndexList[i] + "_y" == inputList[j].nativeElement.name) {
          componentObj['y'] = parseInt(inputList[j].nativeElement.value);
        }
        if (labelIndexList[i] + "_strike" == inputList[j].nativeElement.name) {
          if (inputList[j].nativeElement.value != "0") {
            componentObj['strikeOut'] = this.getStrikeThroughObj(inputList[j].nativeElement.value);
          }
        }
        if (labelIndexList[i] + "_color" == inputList[j].nativeElement.name) {
          componentObj['txtColor'] = this.hexToRgb(inputList[j].nativeElement.value);
        }
        if (labelIndexList[i] + "_name" == inputList[j].nativeElement.name) {
          componentField = {};
          componentField['type'] = 1;
          componentField['fieldValue'] = inputList[j].nativeElement.value;
          componentObj['fields'].push(componentField);
        }

      }
      componentList.push(componentObj);
    }

    let colouredLabel = false;
    if (this.coloured.nativeElement.value == "1") {
      colouredLabel = true;
    }

    this.previewLoading = true;
    this.imageData = null;

    var labelInfo = {
      "width": this.imgWidth.nativeElement.value,
      "height": this.imgHeight.nativeElement.value,
      "border": this.borderSize.nativeElement.value,
      "bgColor": this.hexToRgb(this.backG.nativeElement.value),
      "borderColor": this.hexToRgb(this.borderBG.nativeElement.value),
      "fgColor": this.hexToRgb(this.foreG.nativeElement.value),
      "coloredLabel": colouredLabel,
      "components": componentList
      //[{"verAlign":1,"horAlign":1,"x":0,"y":0,"fontStyle":1,"fontSize":16,"width":0,"height":0,"txtColor":{"r":255,"g":0,"b":0},"fields":[{"type":1,"fieldValue":"MRP"}],"allowSubDecimal":false},{"verAlign":1,"horAlign":3,"x":0,"y":0,"fontStyle":1,"fontSize":16,"width":0,"height":0,"txtColor":{"r":0,"g":0,"b":255},"fields":[{"type":1,"fieldValue":"Our Price"}],"allowSubDecimal":false},{"verAlign":0,"horAlign":1,"x":0,"y":55,"fontStyle":2,"fontSize":30,"width":0,"height":0,"txtColor":{"r":255,"g":0,"b":0},"fields":[{"type":2,"fieldValue":"price"}],"allowSubDecimal":true,"strikeOut":{"type":3,"strokeWidth":3,"strokeColor":{"r":0,"g":0,"b":0}}},{"verAlign":0,"horAlign":0,"x":112,"y":35,"fontStyle":0,"fontSize":0,"width":20,"height":20,"fields":[{"type":3,"fieldValue":"rupee_gr_white.png"}],"allowSubDecimal":false},{"verAlign":0,"horAlign":3,"x":0,"y":55,"fontStyle":2,"fontSize":30,"width":0,"height":0,"fields":[{"type":2,"fieldValue":"discountPrice"}],"allowSubDecimal":true},{"verAlign":0,"horAlign":2,"x":0,"y":90,"fontStyle":2,"fontSize":16,"width":0,"height":0,"fields":[{"type":1,"fieldValue":"Qty "},{"type":2,"fieldValue":"quantityValue"},{"type":2,"fieldValue":"quantityUnit"}],"allowSubDecimal":false},{"verAlign":3,"horAlign":2,"x":0,"y":0,"fontStyle":1,"fontSize":16,"width":0,"height":0,"txtColor":{"r":255,"g":255,"b":0},"fields":[{"type":2,"fieldValue":"itemName"}],"allowSubDecimal":false}]
    };
    return labelInfo;
  }

  saveTemplate(activate, saveOption) {

    let newTemplateId = null;
    if (saveOption == 'Update') {
      newTemplateId = this.labelImageDataId;
    }

    let labelInfo = this.createLabelInfo();
    let templateName = this.templateName.nativeElement.value;
    let paperType = this.paperType.nativeElement.value;
    let templateType = '';
    // let templateType = this.templateType.nativeElement.value;
    if (templateName.trim() == "") {
      this.alertService.error("Invalid template name",
        { autoClose: true }
      );
    } else {
      templateName = templateName.trim();
      let labelInfoString = JSON.stringify(labelInfo);
      // console.log(labelInfoString);
      // labelInfoString = labelInfoString.replace(/\"/g, "\\\"");
      if (this.paperType.nativeElement.value != 'Custom') {
        templateType = '3';
      }
      else {
        templateType = this.templateType.nativeElement.value;
      }

      this.eslService.saveUpdatePriceLabelTempate(paperType, templateName, labelInfoString, templateType, activate, newTemplateId)
        .subscribe(data => {
          this.previewLoading = false;
          if (data['responseCode'] == 200) {
            localStorage.removeItem("designerFieldList");
            this.listFields();
            this._router.navigate(['/designer']);
            this.alertService.success("Template saved!",
              { autoClose: true }
            );
            console.log(labelInfoString);
            this.getLabelTempates();
          } else {
            this.alertService.error(data['responseMessage'],
              { autoClose: true }
            );
          }

        });
    }
    // let activate = "1";


  }

  initialPreview(labelInfo) {
    var productInfo = this.getProductSpecificInfo();

    this.eslService.eslDesignPreview(productInfo, labelInfo)
      .subscribe(data => {
        console.log(data);
        this.previewLoading = false;
        let objectURL = URL.createObjectURL(data);
        this.imageData = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        // this.imageData = data;
      });
  }

  showPreview() {
    var productInfo = this.getProductSpecificInfo();
    let labelInfo = this.createLabelInfo();
    this.eslService.eslDesignPreview(productInfo, labelInfo)
      .subscribe(data => {
        console.log(data);
        this.previewLoading = false;
        let objectURL = URL.createObjectURL(data);
        this.imageData = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        // this.imageData = data;
      });
  }

  printTemplate(Content) {

    console.log("Print");

    this.modalService.open(Content, { ariaLabelledBy: 'modal-basic-title' }).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  rgbToHex(r, g, b) {
    let hexValue = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hexValue.toUpperCase();
  }

}