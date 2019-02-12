export class Contacto {
  public orgid: string;
  public name: string;
  public documentType: string; // 00NA0000001lssk
  public documentNumber: string; // 00NA0000001lsuq
  public email: string;
  public phone: string;
  public subject: string;
  public description: string;
  public MicroSiteCode: string;
  public FormCode: string;
  public from: string;
  public KeyType: string;
  public Recipient: string;


  constructor() {
    this.orgid = '';
    this.name = '';
    this.documentNumber = '';
    this.documentType = '';
    this.email = '';
    this.phone = '';
    this.subject = '';
    this.description = '';
    this.MicroSiteCode = '';
    this.from = '';
    this.KeyType = '';
    this.Recipient = '';


  }
}
