export default {
  name: 'Ime i prezime',
  tel: 'Broj telefona',
  save: 'Sačuvaj',
  clear: 'Prazno',
  cancel: 'Otkaži',
  confirm: 'Potvrdi',
  delete: 'Brisanje',
  loading: 'Učitavanje...',
  noCoupon: 'Još nema kupona',
  nameEmpty: 'Molimo unesite ime',
  addContact: 'Dodaj kontakte',
  telInvalid: 'Molimo unesite broj telefona',
  vanCalendar: {
    end: 'Završetak',
    start: 'Početak',
    title: 'Izaberite Datum',
    weekdays: [
      'Nedelja',
      'Ponedeljak',
      'Utorak',
      'Sreda',
      'Četvrtak',
      'Petak',
      'Subota',
    ],
    monthTitle: (year: number, month: number) => `${year}/${month}`,
    rangePrompt: (maxRange: number) => `Izaberite do ${maxRange} dana`,
  },
  vanCascader: {
    select: 'Molimo izaberite ',
  },
  vanPagination: {
    prev: 'Prethodna strana',
    next: 'Sledeća strana',
  },
  vanPullRefresh: {
    pulling: 'Prevucite nadole da osvežite...',
    loosing: 'Otpustite da osvežite...',
  },
  vanSubmitBar: {
    label: 'Ukupno:',
  },
  vanCoupon: {
    unlimited: 'No threshold',
    discount: (discount: number) => `${discount} puta`,
    condition: (condition: number) => `Dostupno za preko ${condition} juana`,
  },
  vanCouponCell: {
    title: 'Kupon',
    count: (count: number) => `Dostupan ${count}`,
  },
  vanCouponList: {
    exchange: 'Razmeni',
    close: 'Ne koristi',
    enable: 'Iskoristi',
    disabled: 'Nedostupno',
    placeholder: 'Unesite promo kod',
  },
  vanAddressEdit: {
    area: 'Region',
    areaEmpty: 'Molimo odaberite region',
    addressEmpty: 'Molimo upišite adresu',
    addressDetail: 'Adresa',
    defaultAddress: 'Postavi kao podrazumevanu adresu za isporuku',
  },
  vanAddressList: {
    add: 'Dodaj adresu',
  },
};
