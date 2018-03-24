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

    // Согласные, после которых "и", а не "ы"
    static iConsonants = ['ж', 'ш', 'ч'];

    // Non standart case
    static nonStandartCase = ['осташков'];

    // Multiple mutable names delimeter
    static delimiters = [' ', '-на-'];

    // Delimeter for names, where only last part is mutable, like "Каменск-Уральский"
    static immutableDelimiters = ['-'];

    // Abbreviations, they are immutable
    static abbreviations = ['сша', 'оаэ', 'ссср', 'юар'];

    // These words have not cases
    static immutableParts = ['яя', 'дубаи', 'хельсинки', 'пролетариата'];
    static immutableSuffixes = ['сло'];

    // Preposition "на" instead of "в" as usual
    static locationsNa = ['мадагаскар', 'суматра', 'ява', 'куба', 'филиппины', 'сахалин', 'хоккайдо', 'хонсю', 'шпицберген',
        'кюсю', 'тайвань', 'сицилия', 'сардиния', 'сикоку', 'бананал', 'бали', 'ямайка', 'гавайи', 'кипр', 'крит',
        'корсика', 'тринидад', 'тобаго', 'гаити', 'маврикий', 'канары'];

    //static suffixes = ['ов', 'ёв', 'ев', 'ин', 'ын'];

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

        if (this.abbreviations.indexOf(lname) !== -1 || this.immutableParts.indexOf(lname) !== -1) {
            // Have not declensions
            return this.getBaseForm(name);
        }

        for(let i = 0; i < this.delimiters.length; i++) {
            let v = this.delimiters[i];
            if (name.indexOf(v) !== -1) {
                let words = name.split(v);
                return this.composeCasesFromWords(words, v);
            }
        }

        for(let i = 0; i < this.immutableDelimiters.length; i++) {
            let d = this.immutableDelimiters[i];
            if (name.indexOf(d) !== -1) {
                let words = name.split(d);

                return this.composeCases(words.map((v, i) => {
                    if (i == words.length - 1) {
                        return this.getCases(v);
                    } else {
                        return this.getBaseForm(v);
                    }
                }), d);
            }
        }

        let last1 = lname.substr(-1);
        let last2 = lname.substr(-2);
        let last3 = lname.substr(-3);
        let e2th = lname.slice(-2, -1);
        let e3th = lname.slice(-3, -2);
        let e4th = lname.slice(-4, -3);

        // Check for immutable suffix
        for(let i = 0; i < this.immutableSuffixes.length; i++) {
            if (lname.endsWith(this.immutableSuffixes[i])) {
                return this.getBaseForm(name);
            }
        }

        if (last2 === 'ий') {
            // Нижний, Русский, Басьяновский
            let prefix = name.slice(0, -2);

            return [
                name,
                prefix + (this.isVelarConsonant(e3th) ? 'ого' : 'его'),
                prefix + (this.isVelarConsonant(e3th) ? 'ому' : 'ему'),
                name,
                prefix + 'им',
                prefix + this.chooseEndingBySonority(prefix, 'ем', 'ом'),
            ];
        } else if (last2 === 'уй') {
            // Ростовская
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
        } else if (last2 === 'ый' || last2 === 'ой') {
            // Грозный, Благодарный, Береговой
            let prefix = name.slice(0, -2);

            return [
                name,
                prefix + 'ого',
                prefix + 'ому',
                name,
                prefix + (this.isIConsonants(e3th) ? 'и' : 'ы') + 'м',
                prefix + 'ом',
            ];
        } else if (last1 === 'а') {
            // Москва, Рига, Абаза, Анапа
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + (this.isVelarConsonant(e2th) || this.isIConsonants(e2th) ? 'и' : 'ы'),
                prefix + 'е',
                prefix + 'у',
                prefix + (e2th === 'ш' || e2th === 'ц' || e2th === 'ч' ? 'е' : 'о') + 'й',
                prefix + 'е',
            ];
        } else if (last1 === 'я') {
            // Азия, Виля
            let prefix = name.slice(0, -1);
            let u = e2th === 'з' || e2th === 'ь' || e2th === 'л' || e2th === 'е';

            return [
                name,
                prefix + 'и',
                prefix + (u ? 'е' : 'и'),
                prefix + 'ю',
                prefix + 'ей',
                prefix + (u ? 'е' : 'и'),
            ];
        } else if (last2 === 'ай' || last2 === 'ей') {
            // Ишимбай, Аксай, Балей
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'я',
                prefix + 'ю',
                name,
                prefix + 'ем',
                prefix + 'е',
            ];
        } else if (last2 === 'ок' && this.isConsonant(e3th) && this.isVowel(e4th)) {
            // Городок
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
            // Бердюжье
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'я',
                prefix + 'ю',
                name,
                prefix + 'ем',
                prefix + 'ем',
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
        } else if (last3 === 'иев') {
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
        } else if (this.isConsonant(last1) && ! this.isNonStandartCase(lname)) {
            // Париж, Валаам, Киев
            let prefix = name;
            let prefix2 = name;
            if (this.isVowel(e2th) && (last1 === 'ц' || last1 === 'к' && e3th === 'ч' && this.isVowel(e4th))) {
                prefix2 = name.slice(0, -2) + last1;
            }
            let tvSuf = 'ом';
            if (this.isVelarConsonant(e2th) || last1 === 'ж' || last1 === 'ш' || last1 === 'ч' || last1 === 'ц') {
                tvSuf = 'ем';
            } else if (last3 === 'пов' || last2 === 'ин') {
                tvSuf = 'ым';
            }

            return [
                name,
                prefix2 + 'а',
                prefix2 + 'у',
                name,
                prefix2 + tvSuf,
                prefix2 + 'е',
            ];
        } else if (last2 === 'ль' || last2 === 'дь') {
            // Ставрополь, Ярославль, Андреаполь, Вождь
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'я',
                prefix + 'ю',
                name,
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
            // Луки, Березники, Ессентуки, Вербилки
            let prefix = name.slice(0, -1);

            return [
                name,
                lname === 'луки' ? prefix : (this.isConsonant(e3th) && e3th !== 'й' ? prefix.slice(0, -1) + 'ок' : prefix + 'ов'),
                prefix + 'ам',
                prefix + 'и',
                prefix + 'ами',
                prefix + 'ах',
            ];
        } else if (last2 === 'мь' || last2 === 'нь') {
            // Пермь, Кемь, Рязань, Назрань, Айгунь, Камень
            let prefix = name.slice(0, -1);
            if (e3th === 'е') {
                // Камень -> Камня
                prefix = name.slice(0, -3) + name.slice(-2, -1)
            }
            let u = e3th === 'у' || e3th === 'е';

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
        } else if (last2 === 'ны') {
            // Челны
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'ов',
                prefix + 'ам',
                prefix + 'ы',
                prefix + 'ами',
                prefix + 'ах',
            ];
        } else if (last2 === 'ть') {
            // Область
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'и',
                prefix + 'и',
                name,
                prefix + 'ью',
                prefix + 'и',
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
        } else if (last2 === 'ое' || last2 === 'ый' || last2 === 'ий') {
            // Ягодное, Агинское, Алмазный, Еленский, Большое
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
        } else if (last2 === 'ши' || last2 === 'чи' || last1 === 'ы') {
            // Кириши, Бежаницы, Борогонцы
            let prefix = name.slice(0, -1);
            let rodSuf = 'ов';
            if ((e2th === 'ц' || e2th === 'р') && this.isVowel(e3th)) {
                // Бежаницы && ! Борогонцы
                rodSuf = '';
            } else if (last2 === 'ши' || last2 === 'чи') {
                rodSuf = 'ей';
            }

            return [
                name,
                prefix + rodSuf,
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
        } else if (last3 === 'гли') {
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
        /*} else if (this.suffixes.indexOf(last2) !== -1) {
            let prefix = name;

            return [
                name,
                prefix + 'а',
                prefix + 'у',
                name,
                prefix + 'ом',
                prefix + 'ом',
            ];*/
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
        return this.composeCases(words.map(p => this.getCases(p)), delimeter);
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
        if (this.isSonorousConsonant(last)) {
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
