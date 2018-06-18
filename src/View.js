import CliTable from 'cli-table3';

export function showAuthors (authors) {
  const table = new CliTable({
    head      : ['UUID', 'Name'],
    colWidths : [10, 60],
  });

  authors.forEach(a => {
    table.push(
        [a.get('uuid'), a.get('name')]
    );
  });

  console.log(table.toString());
}

export function showWorks (works) {
  const table = new CliTable({
    head      : ['UUID', 'Title'],
    colWidths : [10, 60],
  });

  works.forEach(w => {
    table.push(
        [w.get('uuid'), w.get('title')]
    );
  });

  console.log(table.toString());
}

export function showCards (cards) {
  const table = new CliTable({
    head      : ['WorkId', 'Title', 'Author'],
    colWidths : [10, 60, 20],
  });

  cards.forEach(c => {
    table.push(
        [c.get('workId'), c.get('workTitle'), c.get('authorName')]
    );
  });

  console.log(table.toString());
}

export function showWorkText (body, length) {
  console.log(
    body.replace(/［＃.*］/g, '')
    .slice(0, length || body.length)
    .trim()
  );
}
