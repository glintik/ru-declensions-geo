export default class GeoNamesDeclensions {
    // Согласные
    static consonants = [
        'б', 'в', 'г', 'д', 'ж', 'з', 'й', 'к', 'л', 'м', 'н', 'п', 'р', 'с', 'т', 'ф', 'х', 'ц', 'ч', 'ш', 'щ',
    ];

    // Гласные
    static vowels = [
        'а', 'и', 'е', 'ё', 'о', 'у', 'ы', 'э', 'ю',
    ];

    // Задненёбные согласные
    static velarConsonants = ['г', 'к', 'х'];

    // Звонкие согласные
    static sonorousConsonants = ['б', 'в', 'г', 'д', 'з', 'ж', 'л', 'м', 'н', 'р'];

    // Глухие согласные
    static deafConsonants = ['п', 'ф', 'к', 'т', 'с', 'ш', 'х', 'ч', 'щ'];

    // Согласные, после которых "и", а не "ы", а так же "е", а не "о"
    static iConsonants = ['ж', 'ш', 'щ', 'ч'];

    // Multiple mutable names delimeter
    static delimiters = [' ', '-на-'];

    // Delimeter for names, where only last part is mutable, like "Каменск-Уральский"
    static immutableDelimiters = ['-'];

    // Popular abbreviations, they are immutable
    static abbreviations = ['сша', 'оаэ', 'ссср', 'юар'];

    // These words have not cases
    static immutableParts = ['бич', 'хиллз', 'стрит', 'сквер', 'куба', 'спрингс'];
    static immutableWords = ['яя', 'шмидта', 'дубаи', 'хельсинки', 'пролетариата'];
    static immutableSuffixes = ['сло', 'нгли', 'ухи', 'гри', 'рных', 'эли', 'шали', 'чили', 'лиси', 'вуа', 'ьота',
        'саки', 'аа', 'уоки'];

    // Preposition "на" instead of "в" as usual - popular islands
    static locationsNa = ['мадагаскар', 'суматра', 'ява', 'куба', 'филиппины', 'сахалин', 'хоккайдо', 'хонсю', 'шпицберген',
        'кюсю', 'тайвань', 'сицилия', 'сардиния', 'сикоку', 'бананал', 'бали', 'ямайка', 'гавайи', 'кипр', 'крит',
        'корсика', 'тринидад', 'тобаго', 'гаити', 'маврикий', 'канары', 'корфу', 'родес', 'ланцарот', 'мальта', 'мадейра',
        'тасмания', 'реюньон', 'фиджи', 'майорка', 'тенерифе', 'мадура', 'хайнань', 'борнео', 'цейлон', 'ява', 'минданао'
    ];

    /**
     * Get cases for given name
     * @param name Geographical name
     * @returns {*} Array with 6 cases or null if empty string given
     */
    static getCases(name) {
        let lname = typeof name === 'string' ? name.toLowerCase() : '';
        if (lname.length == 0) {
            return null;
        }

        for(let i = 0; i < this.delimiters.length; i++) {
            let v = this.delimiters[i];
            if (name.indexOf(v) !== -1) {
                let words = name.split(v);
                return this.composeCasesFromWords(words, v);
            }
        }

        for(let i = 0; i < this.immutableDelimiters.length; i++) {
            let v = this.immutableDelimiters[i];
            if (name.indexOf(v) !== -1) {
                let words = name.split(v);
                return this.composeCases(words.map((p, i) => {
                    if (i == words.length - 1 && this.immutableParts.indexOf(p.toLowerCase()) === -1) {
                        // Mutable part
                        return this.getCasesFromOneWord(p, i, words.length);
                    } else {
                        // Immutable part
                        return this.getBaseForm(p);
                    }
                }), v);
            }
        }

        if (this.abbreviations.indexOf(lname) !== -1) {
            // Have not declensions
            return this.getBaseForm(name);
        }

        return this.getCasesFromOneWord(name);
    }

    /**
     * Get cases for given name
     * @param name Geographical name
     * @param num Order number of word in phrase
     * @param count Count of words in phrase
     * @returns {*} Array with 6 cases or null if empty string given
     */
    static getCasesFromOneWord(name, num = 0, count = 1) {
        let lname = typeof name === 'string' ? name.toLowerCase() : '';
        if (lname.length == 0) {
            return null;
        }

        let last1 = lname.substr(-1);
        let last2 = lname.substr(-2);
        let last3 = lname.substr(-3);
        let last4 = lname.substr(-4);
        let last5 = lname.substr(-5);
        let e2th = lname.slice(-2, -1);
        let e3th = lname.slice(-3, -2);
        let e4th = lname.slice(-4, -3);

        // Check for immutable suffix
        for(let i = 0; i < this.immutableSuffixes.length; i++) {
            if (lname.endsWith(this.immutableSuffixes[i])) {
                return this.getBaseForm(name);
            }
        }

        if (this.immutableWords.indexOf(lname) !== -1) {
            return this.getBaseForm(name);
        }

        if (last2 === 'ий') {
            // Нижний, Русский, Басьяновский, Горячий, Еленский, Лисий
            let prefix = name.slice(0, -2);
            if (e3th === 'с') {
                prefix += 'ь';
            }

            return [
                name,
                prefix + (this.isVelarConsonant(e3th) ? 'ого' : 'его'),
                prefix + (this.isVelarConsonant(e3th) ? 'ому' : 'ему'),
                name,
                prefix + 'им',
                prefix + this.chooseEndingBySonority(prefix, 'ем', 'ом'),
            ];
        } else if (last2 === 'уй' || last3 === 'гой' || last4 === 'икой') {
            // Улуй, Уренгой, Чикоя
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'я',
                prefix + 'ю',
                name,
                prefix + 'ем',
                prefix + 'е',
            ];
        } else if (last2 === 'ая') {
            // Ростовская
            let prefix = name.slice(0, -2);

            return [
                name,
                prefix + 'ой',
                prefix + 'ой',
                prefix + 'ую',
                prefix + 'ой',
                prefix + 'ой',
            ];
        } else if (last2 === 'яя') {
            // Верхняя
            let prefix = name.slice(0, -2);

            return [
                name,
                prefix + 'ей',
                prefix + 'ей',
                prefix + 'юю',
                prefix + 'ей',
                prefix + 'ей',
            ];
        } else if (last2 === 'ай' || last2 === 'ей' || last3 === 'дый' || last4 === 'трой' || last3 === 'оле') {
            // Ишимбай, Аксай, Балей, Кадый, Кильдинстрой, Поле
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'я',
                prefix + 'ю',
                name,
                prefix + 'ем',
                prefix + 'е',
            ];
        } else if (last2 === 'ый' || last2 === 'ой') {
            // Грозный, Благодарный, Береговой
            let prefix = name.slice(0, -2);

            return [
                name,
                prefix + 'ого',
                prefix + 'ому',
                name,
                prefix + (this.isIConsonants(e3th) || this.isVelarConsonant(e3th) ? 'и' : 'ы') + 'м',
                prefix + 'ом',
            ];
        } else if ((last3 === 'ева' || last3 === 'ова') && num != count - 1) {
            // Зубова, не последнее слово
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'ой',
                prefix + 'ой',
                prefix + 'у',
                prefix + 'ой',
                prefix + 'ой',
            ];
        } else if (last1 === 'а') {
            // Москва, Рига, Абаза, Анапа, Бискамжа, Суджа, Свеча, Вача
            let prefix = name.slice(0, -1);
            let tvSuf = 'ой';
            if (e2th === 'ш' || e2th === 'ц' ||
                e2th === 'ч' && (e3th === 'и' || e3th === 'я' || e3th === 'а') ||
                e2th === 'ж' && (e3th === 'и' || e3th === 'е' || e3th === 'я' || e3th === 'а')
            ){
                    tvSuf = 'ей';
            }

            return [
                name,
                prefix + (this.isVelarConsonant(e2th) || this.isIConsonants(e2th) ? 'и' : 'ы'),
                prefix + 'е',
                prefix + 'у',
                prefix + tvSuf,
                prefix + 'е',
            ];
        } else if (last1 === 'я') {
            // Азия, Виля, Киря, Заря
            let prefix = name.slice(0, -1);
            let u = e2th === 'з' || e2th === 'ь' || e2th === 'л' || e2th === 'е' || e2th === 'н' || e2th === 'р' || e2th === 'у' || e2th === 'й';

            return [
                name,
                prefix + 'и',
                prefix + (u ? 'е' : 'и'),
                prefix + 'ю',
                prefix + 'ей',
                prefix + (u ? 'е' : 'и'),
            ];
        } else if (last2 === 'ок' && this.isConsonant(e3th) && this.isVowel(e4th)) {
            // Городок, ! Торжок
            let prefix = name.slice(0, -2);

            return [
                name,
                prefix + 'ка',
                prefix + 'ку',
                name,
                prefix + 'ком',
                prefix + 'ке',
            ];
        } else if (last2 === 'ье') {
            // Бердюжье, Заволжье
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'я',
                prefix + 'ю',
                name,
                prefix + 'ем',
                prefix + 'е',
            ];
        } else if (last2 === 'ие') {
            // Возрождение, Великие
            let prefix = name.slice(0, -1);
            let u = e3th === 'к';

            return [
                name,
                prefix + (u ? 'х' : 'я'),
                prefix + (u ? 'м' : 'ю'),
                name,
                prefix + (u ? 'ми' : 'ем'),
                prefix + (u ? 'х' : 'и'),
            ];
        } else if (last4 === 'гиев') {
            // Сергиев
            let prefix = name;

            return [
                name,
                prefix + 'а',
                prefix + 'у',
                name,
                prefix + 'ом',
                prefix + 'ом',
            ];
        } else if (this.isConsonant(last1)) {
            // Париж, Валаам, Киев, Волочек, Турочак
            let prefix = name;
            let prefix2 = name;
            if (this.isVowel(e2th) && (last1 === 'ц' || last3 === 'чек' ||
                    name.length == 3 && e3th === 'л' && ['и', 'е'].indexOf(e2th) !== -1 ||
                    last3 === 'рел' || last3 === 'рёл' || last3 === 'жок')) {
                prefix2 = name.slice(0, -2);
                if (e3th === 'л') {
                    // Елец, Лев
                    prefix2 += 'ь';
                }
                prefix2 += last1;
            }
            let tvSuf = 'ом';
            if (this.isVelarConsonant(e2th) || last1 === 'ж' || last1 === 'ш' || (last1 === 'ч' && e2th !== 'ю') || last1 === 'ц') {
                tvSuf = last1 === 'ч' && e2th === 'а' || last2 === 'кс' ? 'ом' : 'ем';
            } else if ((last3 === 'еев' || last3 === 'пов' || last3 === 'ров' || last3 === 'нов' || last3 === 'лов' ||
                    (last2 === 'ин' && e3th !== 'в')) && name.length > 4) {
                // ! Тихвин
                tvSuf = 'ым';
            }

            return [
                name,
                prefix2 + 'а',
                prefix2 + 'у',
                name,
                prefix2 + tvSuf,
                prefix2 + ((last3 === 'ров' || last3 === 'лов') && count > 1 && num == 0 ? 'ом' : 'е'),
            ];
        } else if ((last3 === 'ель' && ['в', 'к', 'т'].indexOf(e4th) === -1) || last5 === 'юмень' || last4 === 'рень' || last4 === 'зень' || last4 === 'таль') {
            // Ивдель, Мезень, Электросталь, ! Невель, ! Никель, ! Строитель
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'и',
                prefix + 'и',
                name,
                prefix + 'ью',
                prefix + 'и',
            ];
        } else if (last2 === 'ль' || last2 === 'дь') {
            // Ставрополь, Ярославль, Андреаполь, Вождь
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'я',
                prefix + 'ю',
                prefix + (last2 === 'дь' ? 'я' : 'ь'),
                prefix + 'ем',
                prefix + 'е',
            ];
        } else if (last2 === 'рь') {
            // Тверь, Анадырь
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + (e3th === 'ы' ? 'я' : 'и'),
                prefix + (e3th === 'ы' ? 'ю' : 'и'),
                name,
                prefix + (e3th === 'ы' ? 'ем' : 'ью'),
                prefix + (e3th === 'ы' ? 'е' : 'и'),
            ];
        } else if (last2 === 'ло' && e3th !== 'л') {
            // Село
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'а',
                prefix + 'у',
                name,
                prefix + 'ом',
                prefix + 'е',
            ];
        } else if (last2 === 'ки') {
            // Луки, Березники, Ессентуки, Вербилки, Пески, Петушки, Химки, Черемушки
            let prefix = name.slice(0, -1);
            let rodPrefix = prefix;
            let rodSuf = 'ов';
            if (lname === 'луки') {
                rodSuf = '';
            } else if (e3th === 'л' || e3th === 'н' || e3th === 'м') {
                rodSuf = 'ок';
                rodPrefix = prefix.slice(0, -1);
            }

            return [
                name,
                rodPrefix + rodSuf,
                prefix + 'ам',
                prefix + 'и',
                prefix + 'ами',
                prefix + 'ах',
            ];
        } else if (last2 === 'мь' || last2 === 'нь' || last2 === 'ть') {
            // Пермь, Кемь, Рязань, Назрань, Айгунь, Камень, Кемь, Область, Локоть
            let prefix = name.slice(0, -1);
            if ((['е'].indexOf(e3th) !== -1 || last3 === 'оть') && name.length > 4) {
                // Камень -> Камня, Локоть -> Локтя
                prefix = name.slice(0, -3) + name.slice(-2, -1)
            }
            let u = (['е'].indexOf(e3th) !== -1 || last3 === 'оть') && name.length > 4;

            return [
                name,
                prefix + (u ? 'я' : 'и'),
                prefix + (u ? 'ю' : 'и'),
                name,
                prefix + (u ? 'ем' : 'ью'),
                prefix + (u ? 'е' : 'и'),
            ];
        } else if (last2 === 'ые' || last2 === 'ие') {
            // Набережные
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'х',
                prefix + 'м',
                prefix + 'е',
                prefix + 'ми',
                prefix + 'х',
            ];
        } else if (last2 === 'зь') {
            // Абезь
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'и',
                prefix + 'и',
                name,
                prefix + 'ем',
                prefix + 'е',
            ];
        } else if (last2 === 'шь' || last2 === 'щь') {
            // Будогощь
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'и',
                prefix + 'и',
                name,
                prefix + 'ью',
                prefix + 'и',
            ];
        } else if (last3 === 'ино' || last3 === 'ыно' || last3 === 'ово' || last3 === 'ево' || last3 === 'ёво') {
            // Новый вариант - без склонения
            // Тушино, Прямицыно, Иваново, Солнцево, Огарёво

            return this.getBaseForm(name);
        } else if (last2 === 'ое' || last2 === 'ый') {
            // Ягодное, Агинское, Алмазный, Большое
            let prefix = name.slice(0, -2);
            let tvSuf = 'ы';
            if (e2th === 'и' || this.isVelarConsonant(e3th) || this.isIConsonants(e3th)) {
                tvSuf = 'и';
            }

            return [
                name,
                prefix + 'ого',
                prefix + 'ому',
                name,
                prefix + tvSuf + 'м',
                prefix + 'ом',
            ];
        } else if (last2 === 'ши' || last2 === 'щи' || last2 === 'чи' || last1 === 'ы') {
            // Челны, Кириши, Мытищи, Бежаницы, Борогонцы, Ливны, Люберцы, Поныри, Канны, Фивы, Татры
            let prefix = name.slice(0, -1);
            let rodPrefix = prefix;
            let rodSuf = 'ов';
            if (last1 === 'ы' && ['щ', 'ц', 'р', 'н', 'т', 'с'].indexOf(e2th) !== -1 && this.isVowel(e3th) ||
                    ['хты', 'ивы', 'нны', 'ищи', 'тры'].indexOf(last3) !== -1) {
                // Бежаницы && ! Борогонцы
                rodSuf = '';
            } else if (last3 === 'рцы') {
                // Люберцы
                rodPrefix = name.slice(0, -2)
                rodSuf = 'ец';
            } else if (last2 === 'ши' || last2 === 'щи' || last2 === 'чи' || last2 === 'ри') {
                rodSuf = 'ей';
            } else if (last4 === 'анцы') {
                // Сланцы, ! Клинцы
                rodSuf = 'ев';
            }

            return [
                name,
                last3 === 'вны' ? name.slice(0, -2) + 'ен' : rodPrefix + rodSuf,
                prefix + 'ам',
                name,
                prefix + 'ами',
                prefix + 'ах',
            ];
        } else if (last2 === 'ро') {
            // Вирандозеро
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'а',
                prefix + 'у',
                name,
                prefix + 'ом',
                prefix + 'е',
            ];
        } else if (last2 === 'ще') {
            // Городище
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'а',
                prefix + 'у',
                name,
                prefix + 'ем',
                prefix + 'е',
            ];
        } else if ((last2 === 'ли' && last4 !== 'вали') || last2 === 'зи' || last2 === 'ри') {
            // Электроугли
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'ей',
                prefix + 'ям',
                name,
                prefix + 'ями',
                prefix + 'ях',
            ];
        } else if (last2 === 'аи' || last2 === 'еи') {
            // Гималаи, Пиренеи
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'ев',
                prefix + 'ям',
                name,
                prefix + 'ями',
                prefix + 'ях',
            ];
        } else if (last2 === 'ее') {
            // Дальнее
            let prefix = name.slice(0, -2);

            return [
                name,
                prefix + 'его',
                prefix + 'ему',
                name,
                prefix + 'им',
                prefix + 'ем',
            ];
        }

        return this.getBaseForm(name);
    }

    static getBaseForm(name) {
        return [
            name,
            name,
            name,
            name,
            name,
            name,
        ];
    }

    static getAsObject(arr) {
        return {
            imenit: arr[0],
            rodit: arr[1],
            dat: arr[2],
            vinit: arr[3],
            tvorit: arr[4],
            predloj: arr[5],
        };
    }

    static composeCasesFromWords(words, delimeter) {
        return this.composeCases(words.map((p, i) => this.getCasesFromOneWord(p, i, words.length)), delimeter);
    }

    static composeCases(words, delimeter) {
        let res = ['', '', '', '', '', ''];
        words.forEach(c => {
            c.forEach((v, i) => {
                res[i] = res[i].length ? res[i] + delimeter + v : v;
            });
        });

        return res;
    }

    static isVelarConsonant(v) {
        return this.velarConsonants.indexOf(v) !== -1;
    }

    static isConsonant(v) {
        return this.consonants.indexOf(v) !== -1;
    }

    static isVowel(v) {
        return this.vowels.indexOf(v) !== -1;
    }

    static isIConsonants(v) {
        return this.iConsonants.indexOf(v) !== -1;
    }

    // И или Ы после шипящей
    static getIConsonant(v) {
        return this.isIConsonants(v) ? 'и' : 'ы';
    }

    /**
     * Выбирает первое или второе окончание в зависимости от звонкости/глухости в конце слова.
     * @param word Слово (или префикс), на основе звонкости которого нужно выбрать окончание
     * @param ifSonorous Окончание, если слово оканчивается на звонкую согласную
     * @param ifDeaf Окончание, если слово оканчивается на глухую согласную
     * @return Первое или второе окончание
     */
    static chooseEndingBySonority(word, ifSonorous, ifDeaf) {
        let last = word.slice(-1);
        if (this.isSonorousConsonant(last) || this.isIConsonants(last) || last === 'ь') {
            return ifSonorous;
        } else if (this.isDeafConsonant(last)) {
            return ifDeaf;
        }

        throw new Exception('Not implemented');
    }

    /**
     * Проверка звонкости согласной
     */
    static isSonorousConsonant(char) {
        return this.sonorousConsonants.indexOf(char) !== -1;
    }

    /**
     * Проверка глухости согласной
     */
    static isDeafConsonant(char) {
        return this.deafConsonants.indexOf(char) !== -1;
    }

    /**
     * Check for non standart case
     * @param char
     * @returns {boolean} True, if name has non standart cases
     */
    static isNonStandartCase(name) {
        return this.nonStandartCase.indexOf(name) !== -1;
    }

    static isLocationNa(name) {
        return this.locationsNa.indexOf(name) !== -1;
    }

    /**
     * Get string "в/на XXX" for a given toponym
     * @param name Toponym name
     * @returns {string} Example: "в Санкт-Петербурге", "на Кубе", "во Франции"
     */
    static inLocation(name) {
        let lname = typeof name === 'string' ? name.toLowerCase() : '';
        let preposition = this.isLocationNa(lname) ? 'на' : 'в';
        let first1 = lname.slice(0, 1);
        let s2th = lname.slice(1, 2);
        if ((first1 === 'в' || first1 === 'ф') && ! this.isVowel(s2th)) {
            preposition += 'о';
        }
        let cases = this.getCases(name);

        return `${preposition} ${cases[5]}`;
    }
}
