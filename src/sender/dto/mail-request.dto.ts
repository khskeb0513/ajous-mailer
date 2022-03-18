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
    content: string,
  ) {
    this.to = to;
    this.from = `${senderName} <${senderAddress}>`;
    this.content = [
      {
        type: 'text/plain',
        value: content,
      },
      {
        type: 'text/html',
        value: content,
      },
    ];
  }

  from: string;
  content: MailContent[];
}
