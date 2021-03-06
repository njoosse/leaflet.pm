describe('Testing the Toolbar', () => {
    const mapSelector = '#map';

    it('Repositions The Toolbar', () => {
        cy.get('.leaflet-pm-toolbar')
            .parent('.leaflet-top.leaflet-left')
            .should('exist');

        cy.window().then(({ map }) => {
            map.pm.addControls({
                position: 'topright',
            });
        });

        cy.get('.leaflet-pm-toolbar')
            .parent('.leaflet-top.leaflet-right')
            .should('exist');

        cy.window().then(({ map }) => {
            map.pm.addControls({
                position: 'bottomright',
            });
        });

        cy.get('.leaflet-pm-toolbar')
            .parent('.leaflet-bottom.leaflet-right')
            .should('exist');

        cy.window().then(({ map }) => {
            map.pm.addControls({
                position: 'bottomleft',
            });
        });

        cy.get('.leaflet-pm-toolbar')
            .parent('.leaflet-bottom.leaflet-left')
            .should('exist');

        cy.window().then(({ map }) => {
            map.pm.addControls({
                position: 'topleft',
            });
        });
    });

    it('Handles Button States', () => {
        cy.toolbarButton('edit')
            .click()
            .closest('.button-container')
            .should('have.class', 'active');

        cy.toolbarButton('marker')
            .click()
            .closest('.button-container')
            .should('have.class', 'active');

        cy.toolbarButton('edit')
            .closest('.button-container')
            .should('have.not.class', 'active');

        cy.toolbarButton('polyline').click();
        cy.toolbarButton('polygon').click();
        cy.toolbarButton('circle').click();
        cy.toolbarButton('rectangle').click();
        cy.toolbarButton('cut').click();
        cy.toolbarButton('edit').click();
        cy.toolbarButton('delete').click();
        cy.toolbarButton('circle').click();
        cy.toolbarButton('circle').click();
        cy.toolbarButton('circle')
            .click()
            .closest('.button-container')
            .should('have.class', 'active');

        cy.toolbarButton('edit')
            .closest('.button-container')
            .should('have.not.class', 'active');
        cy.toolbarButton('polyline')
            .closest('.button-container')
            .should('have.not.class', 'active');
        cy.toolbarButton('delete')
            .closest('.button-container')
            .should('have.not.class', 'active');
        cy.toolbarButton('rectangle')
            .closest('.button-container')
            .should('have.not.class', 'active');
    });

    it('Reacts to programmatic state change', () => {
        cy.window().then(({ map }) => {
            map.pm.enableGlobalEditMode();
        });

        cy.toolbarButton('edit')
            .closest('.button-container')
            .should('have.class', 'active');

        cy.window().then(({ map }) => {
            map.pm.toggleGlobalRemovalMode();
        });

        cy.toolbarButton('edit')
            .closest('.button-container')
            .should('have.not.class', 'active');
        cy.toolbarButton('delete')
            .closest('.button-container')
            .should('have.class', 'active');

        cy.window().then(({ map }) => {
            map.pm.toggleGlobalRemovalMode();
            map.pm.toggleGlobalRemovalMode();
            map.pm.toggleGlobalRemovalMode();
        });

        cy.toolbarButton('delete')
            .closest('.button-container')
            .should('have.not.class', 'active');

        cy.window().then(({ map }) => {
            map.pm.toggleGlobalEditMode();
            map.pm.toggleGlobalRemovalMode();

            map.pm.enableDraw('Marker');
        });

        cy.toolbarButton('delete')
            .closest('.button-container')
            .should('have.not.class', 'active');

        cy.toolbarButton('edit')
            .closest('.button-container')
            .should('have.not.class', 'active');

        cy.toolbarButton('marker')
            .closest('.button-container')
            .should('have.class', 'active');

        cy.toolbarButton('marker').click();
    });

    it('supports fontawesome', () => {
        cy.get('.fa-map-marker-alt').should('not.exist');
        cy.get('.fa-pencil-alt').should('not.exist');
        cy.get('.fa-trash-alt').should('not.exist');

        cy.window().then(({ map }) => {
            map.pm.addControls({
                useFontAwesome: true,
                removalMode: false,
            });
        });

        cy.get('.fa-map-marker-alt').should('exist');
        cy.get('.fa-pencil-alt').should('exist');
        cy.get('.fa-trash-alt').should('not.exist');
    });

    it('has functioning actions', () => {
        cy.toolbarButton('polygon').click();

        cy.get('.button-container.active .action-cancel').should('exist');

        cy.get('.button-container.active .action-cancel').click();

        cy.get('.button-container.active .action-cancel').should('not.exist');

        cy.toolbarButton('polygon').click();

        cy.get(mapSelector)
            .click(250, 250)
            .click(270, 80)
            .click(300, 80)
            .click(280, 280)
            .click(200, 285);

        cy.hasVertexMarkers(6);

        cy.get('.button-container.active .action-finish').click();

        cy.hasVertexMarkers(0);

        cy.toolbarButton('edit').click();

        cy.hasVertexMarkers(5);

        cy.get('.button-container.active .action-cancel').click();

        cy.hasVertexMarkers(0);
    });
});
