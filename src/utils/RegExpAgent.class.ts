export class RegExpAgent {
  static get LIST_OF_AGENTS(): RegExp {
    return /<li class=\"agent-item\" data-key=\"\d+\">(.|\n)*?<\/li>/gi;
  }

  static get ID(): RegExp {
    return /(?<=href=\"\/agent\/profile\?id=)(\d*)/gi;
  }

  static get AGENT_NAME(): RegExp {
    return /(?<=>)([\w\s]+)(?=<\/a>)/gi;
  }

  static get RSAC(): RegExp {
    return /(?<=Rsac : )(\d+)/gi;
  }

  static get EMAIL(): RegExp {
    return /(?<=mailto:)(.*?)(?=")/gi;
  }

  static get PHONE_NUMBER(): RegExp {
    return /(?<=tel:)(.*?)(?=")/gi;
  }

  static get WEBSITE(): RegExp {
    return /(?<=a href=")(.*?)(?=" target="_blank")/gi;
  }

  static LOCATION(value?: string): RegExp {
    if (!value) {
      return /(?<=<div class="agent-about__profession">)([\w\s]+)(?=<\/div>)/gi;
    }

    return new RegExp(
      `(?<=<div class="agent-about__profession">)${value}(?=<\/div>)`,
      'gi',
    );
  }
}
