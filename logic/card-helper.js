import _ from 'lodash';

import { Log } from './common/logging.js';

/**
 * Creates a formatted message describing the given card and returns it
 */
export function generateCardMessage(card) {
    let cardName = card.name;
    Log(`Sending ${cardName} to channel.`);
    return generateDescriptionText(card);
}

/**
 * Generates the formatted text description of the given card
 * @author Original by NoxxFlame, adapted by Jozeevis
 */
function generateDescriptionText(card) {
    const ptToString = (card) =>
        `**${card.power.replace(/\*/g, '\\*')}/${card.toughness.replace(
            /\*/g,
            '\\*'
        )}**`;

    const description = [];
    if (!card.card_faces) {
        let cardCost = card.mana_cost
            ? card.mana_cost.replace(new RegExp('[{}]', 'g'), '')
            : '';
        let nameLine = `**${card.name}**`;
        if (cardCost) {
            nameLine += ` - ${cardCost}`;
        }
        description.push(nameLine);

        if (card.type_line) {
            // bold type line
            let type = `${card.printed_type_line || card.type_line}`;
            type += ` (${_.capitalize(card.rarity)})`;
            description.push(type);
        }

        if (card.oracle_text) {
            // reminder text in italics
            const text = card.printed_text || card.oracle_text;
            description.push(
                text.replace(/[()]/g, (m) => (m === '(' ? '_(' : ')_'))
            );
        }

        if (card.flavor_text) {
            // flavor text in italics
            description.push(`_${card.flavor_text}_`);
        }

        if (card.loyalty) {
            // bold loyalty
            description.push(`**Loyalty: ${card.loyalty}**`);
        }

        if (card.power) {
            // bold P/T
            description.push(ptToString(card));
        }

        if (card.image_uris) {
            description.push(getImageUrl(card.image_uris));
        }
    } else {
        // split cards are special
        let nameLine = `**${card.name}**`;
        nameLine += ` _(2-faced card)_`;
        description.push(nameLine);

        card.card_faces.forEach((face) => {
            let faceCost = face.mana_cost
                ? face.mana_cost.replace(new RegExp('[{}]', 'g'), '')
                : '';
            let nameLine = `**${face.name}**`;
            if (faceCost) {
                nameLine += ` - ${faceCost}`;
            }
            description.push(nameLine);

            if (face.type_line) {
                // bold type line
                let type = `${face.printed_type_line || face.type_line}`;
                type += ` (${_.capitalize(card.rarity)})`;
                description.push(type);
            }

            if (face.oracle_text) {
                description.push(
                    face.oracle_text.replace(/[()]/g, (m) =>
                        m === '(' ? '_(' : ')_'
                    )
                );
            }
            if (face.power) {
                description.push(ptToString(face));
            }
            if (face.image_uris) {
                description.push(getImageUrl(face.image_uris));
            }
            description.push('');
        });
    }

    return description.join('\n');
}

/**
 * Returns url from the given imageUris object if a fitting one could be found
 * Prioritizes formats as follows: normal > large > small > png
 */
function getImageUrl(imageUris) {
    if (imageUris.normal) {
        return imageUris.normal;
    } else if (imageUris.large) {
        return imageUris.large;
    } else if (imageUris.small) {
        return imageUris.small;
    } else if (imageUris.png) {
        return imageUris.png;
    }
}
