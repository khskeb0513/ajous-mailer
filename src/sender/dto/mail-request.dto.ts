class MailContent {
  constructor(public value: string) {}
  public type = 'text/html';
}

export class MailRequestDto {
  constructor(
    public to: string[],
    senderName: string,
    senderAddress: string,
    public subject: string,
    content: string[],
  ) {
    this.to = to;
    this.from = `${senderName} <${senderAddress}>`;
    this.content = content.map((value) => new MailContent(value));
  }

  from: string;
  content: MailContent[];
}
