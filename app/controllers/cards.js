JMVC.controllers.cards = function () {

    'use strict';
    
    this.action_index = function () {

        var howmany = JMVC.p.n || 10,
            decks = JMVC.p.decks || 1;

        JMVC.require('games/deck/deck');

        JMVC.getView('vacuum')
            .set({
                'style' : 'margin:20px;width:442px;',
                'id': 'container'
            })
            .render(function () {
                JMVC.deck.initDecks(decks);
                JMVC.deck.shuffle(howmany);
                JMVC.dom.append(JMVC.dom.find('#container'), JMVC.deck.getDecks());
            });
    };
};
