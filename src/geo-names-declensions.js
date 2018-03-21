export default class GeoNamesDeclensions {
    // Согласные
    static consonants = [
        'б', 'в', 'г', 'д', 'ж', 'з', 'й', 'к', 'л', 'м', 'н', 'п', 'р', 'с', 'т', 'ф', 'х', 'ц', 'ч', 'ш', 'щ',
    ];

    // ﻿Задненёбные согласные
    static velarConsonants = ['г', 'к', 'х'];

    // Звонкие согласные
    static sonorousConsonants = ['б', 'в', 'г', 'д', 'з', 'ж', 'л', 'м', 'н', 'р'];

    // Глухие согласные
    static deafConsonants = ['п', 'ф', 'к', 'т', 'с', 'ш', 'х', 'ч', 'щ'];

    static nonStandartCase = ['осташков'];

    static delimiters = [' ', '-на-', '-'];

    static abbreviations = ['сша', 'оаэ', 'ссср', 'юар'];

    static immutableParts = ['санкт', 'дубаи'];

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

        /*if (name.substr(-5) === 'край') {
            return this.composeCasesFromWords();
        }*/
        let last1 = lname.substr(-1);
        let last2 = lname.substr(-2);
        let e1th = lname.slice(-1);
        let e2th = lname.slice(-2, -1);
        let e3th = lname.slice(-3, -2);
        let suffixes = ['ов', 'ёв', 'ев', 'ин', 'ын'];

        if (last2 === 'ий') {
            // Нижний, Русский
            let prefix = name.slice(0, -2);

            return [
                name,
                prefix + (this.isVelarConsonant(e3th) ? 'ого' : 'его'),
                prefix + (this.isVelarConsonant(e3th) ? 'ому' : 'ему'),
                prefix + 'ий',
                prefix + 'им',
                prefix + this.chooseEndingBySonority(prefix, 'ем', 'ом'),
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
        } else if (last2 === 'ый') {
            // Грозный, Благодарный
            let prefix = name.slice(0, -2);

            return [
                prefix + 'ый',
                prefix + 'ого',
                prefix + 'ому',
                prefix + 'ый',
                prefix + 'ым',
                prefix + 'ом',
            ];
        } else if (last1 === 'а') {
            // Москва, Рига
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + (this.isVelarConsonant(e2th) ? 'и' : 'ы'),
                prefix + 'е',
                prefix + 'у',
                prefix + 'ой',
                prefix + 'е',
            ];
        } else if (last1 === 'я') {
            // Азия
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'и',
                prefix + 'и',
                prefix + 'ю',
                prefix + 'ей',
                prefix + 'и',
            ];
        } else if (last1 === 'й') {
            // Ишимбай
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'я',
                prefix + 'ю',
                prefix + 'й',
                prefix + 'ем',
                prefix + 'е',
            ];
        } else if (this.isConsonant(last1) && ! this.isNonStandartCase(lname)) {
            // Париж, Валаам, Киев
            let prefix = name;

            return [
                name,
                prefix + 'а',
                prefix + 'у',
                prefix,
                prefix + (this.isVelarConsonant(e2th) || e1th === 'ж' ? 'ем' : 'ом'),
                prefix + 'е',
            ];
        } else if (last2 === 'ль') {
            // Ставрополь, Ярославль
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'я',
                prefix + 'ю',
                prefix + 'ь',
                prefix + 'ем',
                prefix + 'е',
            ];
        } else if (last2 === 'рь') {
            // Тверь
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'и',
                prefix + 'и',
                prefix + 'ь',
                prefix + 'ью',
                prefix + 'и',
            ];
        } else if (last2 === 'ки') {
            // Березники, Ессентуки
            let prefix = name.slice(0, -1);

            return [
                name,
                lname === 'луки' ? prefix : prefix + 'ов',
                prefix + 'ам',
                prefix + 'и',
                prefix + 'ами',
                prefix + 'ах',
            ];
        } else if (last2 === 'мь' || last2 === 'нь') {
            // Пермь, Кемь, Рязань, Назрань
            let prefix = name.slice(0, -1);

            return [
                name,
                prefix + 'и',
                prefix + 'и',
                prefix + 'ь',
                prefix + 'ью',
                prefix + 'и',
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
        } else if (['е', 'о'].indexOf(last1) !== -1 && suffixes.indexOf(e3th) !== -1 ||
                suffixes.indexOf(last2) !== -1) {
            let prefix = name;
            if (suffixes.indexOf(e3th) !== -1) {
                // ово, ёво, ...
                prefix = name.slice(0, -1);
            }

            return [
                name,
                prefix + 'а',
                prefix + 'у',
                name,
                prefix + 'ым',
                prefix + 'е',
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
        let res = ['', '', '', '', '', ''];
        words.forEach(p => {
            let c = this.getCases(p);
            if (c) {
                c.forEach((v, i) => {
                    res[i] = res[i].length ? res[i] + delimeter + v : v;
                });
            }
        });

        return res;
    }

    static isVelarConsonant(v) {
        return this.velarConsonants.indexOf(v) !== -1;
    }

    static isConsonant(v) {
        return this.consonants.indexOf(v) !== -1;
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

    static isNonStandartCase(char) {
        return this.nonStandartCase.indexOf(char) !== -1;
    }
}
