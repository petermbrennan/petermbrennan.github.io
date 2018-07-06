class EditColumnWidget extends EditLayout {
  selectLayoutTag(){
    return 'select-row-count';
  }

  layoutTag(){
    return 'row';
  }

  layoutTitle(){
    return 'Row';
  }

  layoutClasses(){
    return [
      "one two three four five six",
      "two three four five six",
      "three four five six",
      "four five six",
      "five six",
      "six"
    ];
  }
}

new EditColumnWidget();
