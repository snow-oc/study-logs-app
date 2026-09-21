export class StudyRecord {
  id: string;
  title: string;
  time: number;

  constructor(id: string, title: string, time: number) {
    this.id = id;
    this.title = title;
    this.time = time;
  }
}
